<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions } from '@/constants/business';
import { saveI18n } from '@/service/api';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'I18nOperateDrawer' });

interface Props {
  /** the type of operation */
  operateType: UI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.I18n | null;
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
    add: $t('page.manage.i18n.addI18n'),
    edit: $t('page.manage.i18n.editI18n')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.I18n, 'i18nCode' | 'lang' | 'i18nContent' | 'description' | 'status'> & {
  id?: number;
};

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    i18nCode: '',
    lang: 'zh-CN',
    i18nContent: '',
    description: '',
    status: 'enable'
  };
}

type RuleKey = Extract<keyof Model, 'i18nCode' | 'lang' | 'i18nContent' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  i18nCode: defaultRequiredRule,
  lang: defaultRequiredRule,
  i18nContent: defaultRequiredRule,
  status: defaultRequiredRule
};

const languageOptions = [
  { label: $t('page.manage.i18n.languages.zhCN'), value: 'zh-CN' },
  { label: $t('page.manage.i18n.languages.enUS'), value: 'en-US' }
];

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

  const i18nData = {
    i18nCode: model.value.i18nCode,
    lang: model.value.lang,
    i18nContent: model.value.i18nContent,
    description: model.value.description,
    status: model.value.status,
    ...(model.value.id && { id: model.value.id })
  };

  await saveI18n(i18nData);

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
  <ElDrawer v-model="visible" :title="title" :size="360">
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem :label="$t('page.manage.i18n.form.i18nCode')" prop="i18nCode">
        <ElInput v-model="model.i18nCode" :placeholder="$t('page.manage.i18n.i18nCodePlaceholder')" />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.i18n.form.language')" prop="lang">
        <ElRadioGroup v-model="model.lang">
          <ElRadio v-for="item in languageOptions" :key="item.value" :value="item.value" :label="item.label" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.i18n.form.content')" prop="i18nContent">
        <ElInput
          v-model="model.i18nContent"
          type="textarea"
          :rows="4"
          :placeholder="$t('page.manage.i18n.contentPlaceholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.i18n.form.status')" prop="status">
        <ElRadioGroup v-model="model.status">
          <ElRadio v-for="{ label, value } in enableStatusOptions" :key="value" :value="value" :label="$t(label)" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="$t('page.manage.i18n.form.description')" prop="description">
        <ElInput
          v-model="model.description"
          type="textarea"
          :rows="3"
          :placeholder="$t('page.manage.i18n.descriptionPlaceholder')"
        />
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
