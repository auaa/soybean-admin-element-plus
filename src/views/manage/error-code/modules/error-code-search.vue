<script setup lang="ts">
import { ref } from 'vue';
import { enableStatusOptions, errorCodeLanguageOptions, errorTypeOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({ name: 'ErrorCodeSearch' });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.ErrorCodeSearchParams>('model', { required: true });

const activeName = ref<string>('error-code-search');

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <ElCard class="card-wrapper">
    <ElCollapse v-model="activeName">
      <ElCollapseItem :title="$t('common.search')" name="error-code-search">
        <ElForm :model="model" label-position="right" :label-width="80">
          <ElRow :gutter="24">
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.errorCode.errorCode')" prop="errorCode">
                <ElInput v-model="model.errorCode" :placeholder="$t('page.manage.errorCode.form.errorCode')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.errorCode.errorContent')" prop="errorContent">
                <ElInput v-model="model.errorMessage" :placeholder="$t('page.manage.errorCode.form.errorContent')" />
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.errorCode.language')" prop="language">
                <ElSelect v-model="model.lang" :placeholder="$t('page.manage.errorCode.form.language')" clearable>
                  <ElOption
                    v-for="{ label, value } in translateOptions(errorCodeLanguageOptions)"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.errorCode.errorType')" prop="errorType">
                <ElSelect v-model="model.errorType" :placeholder="$t('page.manage.errorCode.form.errorType')" clearable>
                  <ElOption
                    v-for="{ label, value } in translateOptions(errorTypeOptions)"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem :label="$t('page.manage.errorCode.status')" prop="status">
                <ElSelect v-model="model.status" :placeholder="$t('page.manage.errorCode.form.status')" clearable>
                  <ElOption
                    v-for="{ label, value } in translateOptions(enableStatusOptions)"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :lg="6" :md="8" :sm="12">
              <ElFormItem>
                <ElSpace :size="16">
                  <ElButton type="primary" @click="search">
                    <template #icon>
                      <SvgIcon icon="ic:round-search" />
                    </template>
                    {{ $t('common.search') }}
                  </ElButton>
                  <ElButton @click="reset">
                    <template #icon>
                      <SvgIcon icon="ic:round-refresh" />
                    </template>
                    {{ $t('common.reset') }}
                  </ElButton>
                </ElSpace>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </ElCard>
</template>

<style scoped></style>
