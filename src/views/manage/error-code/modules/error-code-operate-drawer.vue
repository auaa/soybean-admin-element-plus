<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions, errorCodeLanguageOptions, errorTypeOptions } from '@/constants/business';
import { type ErrorCodeModel, addErrorCode } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'ErrorCodeOperateDrawer' });

interface Props {
  /** the type of operation */
  operateType: UI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.ErrorCode | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<UI.TableOperateType, string> = {
    add: $t('page.manage.errorCode.addErrorCode'),
    edit: $t('page.manage.errorCode.editErrorCode')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.ErrorCode, 'errorCode' | 'errorMessage' | 'lang' | 'errorType' | 'errorCause' | 'status'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    errorCode: '',
    errorMessage: '',
    lang: 'zh-CN',
    errorType: '1',
    errorCause: '',
    status: 'enable'
  };
}

type RuleKey = Extract<keyof Model, 'errorCode' | 'errorMessage' | 'lang' | 'errorType' | 'errorCause' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  errorCode: defaultRequiredRule,
  errorMessage: defaultRequiredRule,
  lang: defaultRequiredRule,
  errorType: defaultRequiredRule,
  errorCause: defaultRequiredRule,
  status: defaultRequiredRule
};

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const errorCodeData: ErrorCodeModel = {
    errorCode: model.value.errorCode,
    errorMessage: model.value.errorMessage,
    lang: model.value.lang,
    errorType: model.value.errorType,
    errorCause: model.value.errorCause,
    status: model.value.status
  };

  await addErrorCode({
    ...errorCodeData
  });

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <ElDrawer v-model="visible" :title="title" :size="480">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.errorCode.errorCode')" prop="errorCode">
        <ElInput v-model="model.errorCode" :placeholder="$t('page.manage.errorCode.form.errorCode')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.errorCode.errorContent')" prop="errorContent">
        <ElInput
          v-model="model.errorMessage"
          type="textarea"
          :rows="3"
          :placeholder="$t('page.manage.errorCode.form.errorContent')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.errorCode.language')" prop="language">
        <ElRadioGroup v-model="model.lang">
          <ElRadio v-for="{ label, value } in errorCodeLanguageOptions" :key="value" :value="value" :label="$t(label)" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.errorCode.errorType')" prop="errorType">
        <ElRadioGroup v-model="model.errorType">
          <ElRadio v-for="{ label, value } in errorTypeOptions" :key="value" :value="value" :label="$t(label)" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.errorCode.solution')" prop="solution">
        <ElInput
          v-model="model.errorCause"
          type="textarea"
          :rows="4"
          :placeholder="$t('page.manage.errorCode.form.solution')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.errorCode.status')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in enableStatusOptions" :key="value" :value="value" :label="$t(label)" />
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElSpace :size="16">
        <ElButton @click="closeDrawer">{{ $t('common.cancel') }}</ElButton>
        <ElButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</ElButton>
      </ElSpace>
    </template>
  </ElDrawer>
</template>

<style scoped></style>
