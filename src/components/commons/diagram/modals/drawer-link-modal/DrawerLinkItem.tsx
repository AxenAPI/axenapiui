import {Form, FormItem, RadioButton, RadioGroup} from '@axenix/ui-kit';
import {SelectField} from '@axenix/ui-kit/rhf';
import {FieldValues, Path, UseFormReturn, useController} from 'react-hook-form';

import '@/components/commons/diagram/modals/modals.css';
import {EConnectionType, EObjectToConnect} from '@/enums/common';
import {TSelectOptions} from '@/types/common';

interface IProps<TFormValues> {
  serviceOptions: TSelectOptions;
  topicOptions: TSelectOptions;
  eventsOptions: TSelectOptions;
  httpOptions: TSelectOptions;
  fromNodeFieldName: Path<TFormValues>;
  toNodeFieldName: Path<TFormValues>;
  objectToConnectFieldName: Path<TFormValues>;
  connectionTypeFieldName: Path<TFormValues>;
  eventFieldName: Path<TFormValues>;
  methods: UseFormReturn<TFormValues>;
}

const {CONSUME, PRODUCE} = EConnectionType;

export const DrawerLinkItem = <TFormValues extends FieldValues>({
  connectionTypeFieldName,
  eventFieldName,
  eventsOptions,
  fromNodeFieldName,
  httpOptions,
  methods,
  objectToConnectFieldName,
  serviceOptions,
  toNodeFieldName,
  topicOptions,
}: IProps<TFormValues>) => {
  const {field: objectToConnectField} = useController({
    control: methods.control,
    name: objectToConnectFieldName,
  });
  const {field: connectionTypeField} = useController({
    control: methods.control,
    name: connectionTypeFieldName,
  });

  return (
    <Form layout="vertical">
      <SelectField
        data-testid="create-link-drawer-service-select"
        className="mb-2"
        dropdownStyle={{borderRadius: '3px'}}
        label="Service"
        fieldName={fromNodeFieldName}
        isRequired
        options={serviceOptions ?? []}
        control={methods.control}
      />

      <FormItem isRequired className="mb-2" label="Object to connect">
        <RadioGroup
          buttonStyle="outline"
          optionType="button"
          value={objectToConnectField.value}
          onChange={objectToConnectField.onChange}
        >
          <RadioButton
            style={{borderRadius: '3px 0 0 3px'}}
            value="TOPIC"
            isChecked={objectToConnectField.value === EObjectToConnect.TOPIC}
          >
            Topic
          </RadioButton>

          <RadioButton
            style={{borderRadius: '0 3px 3px 0'}}
            value={EObjectToConnect.HTTP_NODE}
            isChecked={objectToConnectField.value === EObjectToConnect.HTTP_NODE}
            onClick={() => {
              // @ts-ignore
              methods.setValue(connectionTypeFieldName, CONSUME);
            }}
          >
            HTTP-node
          </RadioButton>
        </RadioGroup>
      </FormItem>

      {objectToConnectField.value === EObjectToConnect.TOPIC ? (
        <SelectField
          data-testid="create-link-drawer-topic-select"
          className="mb-2"
          dropdownStyle={{borderRadius: '3px'}}
          fieldName={toNodeFieldName}
          options={topicOptions ?? []}
          control={methods.control}
        />
      ) : (
        <SelectField
          className="mb-2"
          dropdownStyle={{borderRadius: '3px'}}
          fieldName={toNodeFieldName}
          options={httpOptions ?? []}
          control={methods.control}
        />
      )}

      <FormItem isRequired className="mb-2" label="Connect type">
        <RadioGroup
          buttonStyle="outline"
          optionType="button"
          value={connectionTypeField.value}
          onChange={connectionTypeField.onChange}
        >
          <RadioButton
            style={{borderRadius: '3px 0 0 3px'}}
            value={PRODUCE}
            isChecked={connectionTypeField.value === PRODUCE}
            isDisabled={objectToConnectField.value === EObjectToConnect.HTTP_NODE}
          >
            Produce
          </RadioButton>

          <RadioButton
            style={{borderRadius: '0 3px 3px 0'}}
            value={CONSUME}
            isChecked={connectionTypeField.value === CONSUME}
          >
            Consume
          </RadioButton>
        </RadioGroup>
      </FormItem>

      <SelectField
        data-testid="create-link-drawer-event-select"
        className="mb-0"
        dropdownStyle={{borderRadius: '3px'}}
        label="Event"
        fieldName={eventFieldName}
        isRequired
        options={eventsOptions ?? []}
        control={methods.control}
      />
    </Form>
  );
};
