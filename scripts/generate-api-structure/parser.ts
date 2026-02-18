import { Project, SourceFile, ts, Type } from 'ts-morph';

import { ApiDefinition, ApiMethod } from './types';

function getPropertiesFromInterface(sourceFile: SourceFile, interfaceName: string): { name: string; type: string }[] {
  const anInterface = sourceFile.getInterface(interfaceName);
  if (!anInterface) {
    return [];
  }
  return anInterface.getProperties().map(prop => {
    const typeText = prop.getType().getText(prop, ts.TypeFormatFlags.None);
    return {
      name: prop.getName(),
      type: typeText,
    };
  });
}

function getCleanTypeName(type: Type): string {
  if (!type) return 'any';
  return type.getText(undefined, ts.TypeFormatFlags.None);
}

export function parseApi(apiTsPath: string): ApiDefinition[] {
  const project = new Project({
    compilerOptions: {
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
    },
  });
  const sourceFile = project.addSourceFileAtPath(apiTsPath);
  const apiDefinitions: ApiDefinition[] = [];

  const apiFactoryDeclarations = sourceFile.getVariableDeclarations().filter(v => {
    const name = v.getName();
    return name.endsWith('ApiFactory') && v.getInitializer()?.getKindName() === 'FunctionExpression';
  });

  for (const factory of apiFactoryDeclarations) {
    const apiName = factory.getName().replace('Factory', '');
    const apiDef: ApiDefinition = { name: apiName, methods: [] };

    const factoryInitializer = factory.getInitializerIfKindOrThrow(ts.SyntaxKind.FunctionExpression);
    const returnStatement = factoryInitializer.getFirstDescendantByKind(ts.SyntaxKind.ReturnStatement);

    if (!returnStatement) continue;

    const objectLiteral = returnStatement.getExpressionIfKind(ts.SyntaxKind.ObjectLiteralExpression);
    if (!objectLiteral) continue;

    const methods = objectLiteral.getProperties();

    for (const method of methods) {
      if (method.isKind(ts.SyntaxKind.MethodDeclaration)) {
        const methodName = method.getName();

        const returnType = method.getReturnType();
        let responseType = 'void';
        // The return type is AxiosPromise<T> which is Promise<AxiosResponse<T>>
        const promiseTypeArgs = returnType.getTypeArguments();
        if (promiseTypeArgs.length > 0) {
          // This is AxiosResponse<T>
          const axiosResponseType = promiseTypeArgs[0];
          const axiosTypeArgs = axiosResponseType.getTypeArguments();
          if (axiosTypeArgs.length > 0) {
            // This is T
            responseType = getCleanTypeName(axiosTypeArgs[0]);
          } else {
            // Fallback for types like AxiosResponse<void>
            responseType = 'void';
          }
        }

        const apiMethod: ApiMethod = {
          name: methodName,
          requestType: '',
          responseType: responseType,
          parameters: [],
        };

        const parameters = method.getParameters();
        if (parameters.length > 0) {
          const requestParam = parameters.find(p => p.getName() === 'requestParameters');
          if (requestParam) {
            const paramType = requestParam.getType();
            const paramTypeName = getCleanTypeName(paramType);
            apiMethod.requestType = paramTypeName;
            apiMethod.parameters = getPropertiesFromInterface(sourceFile, paramTypeName);
          }
        }
        apiDef.methods.push(apiMethod);
      }
    }
    apiDefinitions.push(apiDef);
  }

  return apiDefinitions;
}
