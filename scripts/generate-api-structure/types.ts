export interface ApiMethod {
  name: string;
  requestType: string;
  responseType: string;
  parameters: { name: string; type: string }[];
}

export interface ApiDefinition {
  name: string;
  methods: ApiMethod[];
}
