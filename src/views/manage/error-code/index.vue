<script setup lang="tsx">
import { reactive } from 'vue';
import { ElButton, ElPopconfirm, ElTag } from 'element-plus';
import { enableStatusRecord, errorCodeLanguageRecord, errorTypeRecord } from '@/constants/business';
import { batchDeleteErrorCode, deleteErrorCode, fetchGetErrorCodeList } from '@/service/api';
import { defaultTransform, useTableOperate, useUIPaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import ErrorCodeOperateDrawer from './modules/error-code-operate-drawer.vue';
import ErrorCodeSearch from './modules/error-code-search.vue';

const searchParams = reactive(getInitSearchParams());

function getInitSearchParams(): Api.SystemManage.ErrorCodeSearchParams {
  return {
    current: 1,
    size: 10,
    status: undefined,
    errorCode: undefined,
    errorContent: undefined,
    language: undefined,
    errorType: undefined
  };
}

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useUIPaginatedTable({
  paginationProps: {
    currentPage: searchParams.current,
    pageSize: searchParams.size
  },
  api: () => fetchGetErrorCodeList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.currentPage;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { type: 'selection', width: 48 },
    { type: 'index', label: $t('common.index'), width: 64 },
    { prop: 'errorCode', label: $t('page.manage.errorCode.errorCode'), minWidth: 120 },
    { prop: 'errorContent', label: $t('page.manage.errorCode.errorContent'), minWidth: 200 },
    {
      prop: 'language',
      label: $t('page.manage.errorCode.language'),
      width: 100,
      formatter: (row: Api.SystemManage.ErrorCode) => $t(errorCodeLanguageRecord[row.language])
    },
    {
      prop: 'errorType',
      label: $t('page.manage.errorCode.errorType'),
      width: 120,
      formatter: (row: Api.SystemManage.ErrorCode) => $t(errorTypeRecord[row.errorType])
    },
    { prop: 'solution', label: $t('page.manage.errorCode.solution'), minWidth: 200 },
    {
      prop: 'status',
      label: $t('page.manage.errorCode.status'),
      width: 100,
      formatter: (row: Api.SystemManage.ErrorCode) => (
        <ElTag type={row.status === '1' ? 'success' : 'info'}>{$t(enableStatusRecord[row.status || '1'])}</ElTag>
      )
    },
    {
      prop: 'operate',
      label: $t('common.operate'),
      width: 130,
      formatter: (row: Api.SystemManage.ErrorCode) => (
        <div class="flex-center gap-8px">
          <ElButton link type="primary" size="small" onClick={() => handleEdit(row.id)}>
            {$t('common.edit')}
          </ElButton>
          <ElPopconfirm
            title={$t('common.confirmDelete')}
            onConfirm={() => handleDelete(row.id)}
            icon="iconify mdi:delete"
            iconColor="red"
          >
            {{
              reference: () => (
                <ElButton link type="danger" size="small">
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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  'id',
  getData
);

async function handleBatchDelete() {
  await batchDeleteErrorCode(checkedRowKeys.value.map(item => (item as unknown as Api.SystemManage.ErrorCode).id));
  onDeleted();
}

async function handleDelete(id: number) {
  await deleteErrorCode(id);
  onDeleted();
}

function resetSearchParams() {
  Object.assign(searchParams, getInitSearchParams());
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ErrorCodeSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ElCard class="card-wrapper sm:flex-1-hidden" body-class="ht50">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.errorCode.title') }}</p>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
          />
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
      <ErrorCodeOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  .ht50 {
    height: calc(100% - 50px);
  }
}
</style>
