<script setup lang="tsx">
/* eslint-disable @typescript-eslint/no-use-before-define */
import { reactive } from 'vue';
import { ElButton, ElPopconfirm, ElTag } from 'element-plus';
import { enableStatusRecord } from '@/constants/business';
import { deleteI18n, disableI18n, enableI18n, fetchGetI18nList } from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import I18nOperateDrawer from './modules/i18n-operate-drawer.vue';

defineOptions({
  name: 'ManageI18n'
});

const searchParams = reactive(getInitSearchParams());

function getInitSearchParams(): Api.SystemManage.I18nSearchParams {
  return {
    current: 1,
    size: 10,
    status: undefined,
    i18nCode: undefined,
    lang: undefined,
    i18nContent: undefined
  };
}

const { columns, data, loading, getData, getDataByPage, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.current,
    pageSize: searchParams.size
  },
  api: () => fetchGetI18nList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.currentPage;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { type: 'selection', width: 48 },
    { prop: 'i18nCode', label: $t('page.manage.i18n.i18nCode'), minWidth: 120 },
    {
      prop: 'lang',
      label: $t('page.manage.i18n.language'),
      width: 100,
      formatter: (row: Api.SystemManage.I18n) => {
        const langLabels: Record<Api.SystemManage.I18nLanguage, string> = {
          'zh-CN': $t('page.manage.i18n.languages.zhCN'),
          'en-US': $t('page.manage.i18n.languages.enUS')
        };
        return langLabels[row.lang] || row.lang;
      }
    },
    { prop: 'i18nContent', label: $t('page.manage.i18n.content'), minWidth: 200 },
    {
      prop: 'status',
      label: $t('page.manage.i18n.status'),
      width: 100,
      formatter: (row: Api.SystemManage.I18n) => (
        <ElTag type={row.status === 'enable' ? 'success' : 'info'}>
          {$t(enableStatusRecord[row.status || 'enable'])}
        </ElTag>
      )
    },
    { prop: 'description', label: $t('page.manage.i18n.description'), minWidth: 120 },
    {
      prop: 'operate',
      label: $t('common.operate'),
      width: 200,
      formatter: (row: Api.SystemManage.I18n) => (
        <div class="flex-center gap-8px">
          <ElButton link type="primary" size="small" onClick={() => handleEdit(row.id)}>
            <icon-ic-round-edit class="mr-4px text-icon" />
            {$t('common.edit')}
          </ElButton>
          {row.status === 'enable' ? (
            <ElButton link type="warning" size="small" onClick={() => handleDisable(row.id)}>
              <icon-ic-round-block class="mr-4px text-icon" />
              {$t('page.manage.common.status.disable')}
            </ElButton>
          ) : (
            <ElButton link type="success" size="small" onClick={() => handleEnable(row.id)}>
              <icon-ic-round-check-circle class="mr-4px text-icon" />
              {$t('page.manage.common.status.enable')}
            </ElButton>
          )}
          <ElPopconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(row.id)}>
            {{
              reference: () => (
                <ElButton link type="danger" size="small">
                  <icon-ic-round-delete class="mr-4px text-icon" />
                  {$t('common.delete')}
                </ElButton>
              )
            }}
          </ElPopconfirm>
        </div>
      )
    }
  ]
});

const { operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted, drawerVisible } = useTableOperate(
  data,
  'id',
  getData
);

async function handleBatchDelete() {
  // Use Promise.all for better performance instead of await in loop
  const deletePromises = checkedRowKeys.value.map(key => deleteI18n([(key as unknown as Api.SystemManage.I18n).id]));
  await Promise.all(deletePromises);
  onDeleted();
}

async function handleDelete(id: number) {
  await deleteI18n([id]);
  onDeleted();
}

async function handleEnable(id: number) {
  await enableI18n(id);
  window.$message?.success($t('page.manage.common.status.enableSuccess'));
  getData();
}

async function handleDisable(id: number) {
  await disableI18n(id);
  window.$message?.success($t('page.manage.common.status.disableSuccess'));
  getData();
}

function resetSearchParams() {
  Object.assign(searchParams, getInitSearchParams());
  getDataByPage();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- Simple Search Form -->
    <ElCard class="card-wrapper">
      <div class="flex flex-wrap gap-16px p-16px">
        <div class="flex flex-wrap gap-16px">
          <ElFormItem :label="$t('page.manage.i18n.i18nCode')" class="mb-0">
            <ElInput
              v-model="searchParams.i18nCode"
              :placeholder="$t('page.manage.i18n.i18nCodePlaceholder')"
              clearable
              class="w-200px"
            />
          </ElFormItem>
          <ElFormItem :label="$t('page.manage.i18n.content')" class="mb-0">
            <ElInput
              v-model="searchParams.i18nContent"
              :placeholder="$t('page.manage.i18n.contentPlaceholder')"
              clearable
              class="w-200px"
            />
          </ElFormItem>
        </div>
        <div class="flex gap-8px">
          <ElButton type="primary" @click="() => getDataByPage()">
            <template #icon>
              <icon-ic-round-search class="text-icon" />
            </template>
            {{ $t('common.search') }}
          </ElButton>
          <ElButton @click="resetSearchParams">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ $t('common.reset') }}
          </ElButton>
        </div>
      </div>
    </ElCard>

    <!-- Table -->
    <ElCard class="card-wrapper sm:flex-1-hidden" body-class="ht50">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.i18n.title') }}</p>
          <div class="flex gap-8px">
            <ElButton type="primary" @click="handleAdd">
              <template #icon>
                <icon-ic-round-add class="text-icon" />
              </template>
              {{ $t('page.manage.i18n.addI18n') }}
            </ElButton>
            <ElButton type="danger" :disabled="checkedRowKeys.length === 0" @click="handleBatchDelete">
              <template #icon>
                <icon-ic-round-delete class="text-icon" />
              </template>
              {{ $t('common.batchDelete') }}
            </ElButton>
            <ElButton @click="getData">
              <template #icon>
                <icon-ic-round-refresh class="text-icon" />
              </template>
              {{ $t('common.refresh') }}
            </ElButton>
          </div>
        </div>
      </template>
      <div class="h-[calc(100%-50px)]">
        <ElTable
          v-loading="loading"
          height="100%"
          border
          class="sm:h-full"
          :data="data"
          row-key="id"
          @selection-change="checkedRowKeys = $event"
        >
          <ElTableColumn v-for="col in columns" :key="col.prop" v-bind="col" />
        </ElTable>
        <div class="mt-20px flex justify-end">
          <ElPagination
            v-if="mobilePagination.total"
            layout="total,prev,pager,next,sizes"
            v-bind="mobilePagination"
            @current-change="mobilePagination['current-change']"
            @size-change="mobilePagination['size-change']"
          />
        </div>
      </div>
    </ElCard>

    <!-- I18n Operate Drawer -->
    <I18nOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  .ht50 {
    height: calc(100% - 50px);
  }
}
</style>
