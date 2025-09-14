<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import {
  ElButton,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElRadio,
  ElRadioGroup,
  ElTree
} from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { useBoolean } from '@sa/hooks';
import { enableStatusRecord } from '@/constants/business';
import {
  addValueSet,
  deleteSingleValueSet,
  fetchGetValueSetById,
  fetchGetValueSetTree,
  updateValueSet
} from '@/service/api';
import { $t } from '@/locales';

const { bool: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean();

// Tree data and selected node
const treeData = ref<Api.SystemManage.ValueSetTree[]>([]);
const selectedNodeId = ref<number | null>(null);
const treeRef = ref();

// Form data and mode
const formRef = ref();
const formData: Ref<Partial<Api.SystemManage.ValueSet> | null> = ref(null);
const isEditMode = ref(false);
const isAddMode = ref(false);

// Initialize form with default empty state
function initializeDefaultForm() {
  formData.value = {
    id: 0,
    vsCode: '',
    vsName: '',
    vsValue: '',
    sort: 0,
    parentPath: '',
    status: 'enable' as Api.Common.ActiveStatus,
    description: ''
  };
  isAddMode.value = true;
  isEditMode.value = false;
}

// Tree props
const treeProps = {
  children: 'children',
  label: 'vsName',
  value: 'id',
  isLeaf: 'leafFlag'
};

// Helper function to find node by id in tree
function findNodeById(nodes: Api.SystemManage.ValueSetTree[], id: number): Api.SystemManage.ValueSetTree | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// Helper function to update node data in tree
function updateNodeInTree(
  nodes: Api.SystemManage.ValueSetTree[],
  id: number,
  updates: Partial<Api.SystemManage.ValueSetTree>
): boolean {
  for (const node of nodes) {
    if (node.id === id) {
      Object.assign(node, updates);
      return true;
    }
    if (node.children && updateNodeInTree(node.children, id, updates)) {
      return true;
    }
  }
  return false;
}

// Lazy load child nodes
async function loadChildNodes(node: any, resolve: any) {
  startLoading();
  try {
    const pid = node?.data.id;
    const { data } = await fetchGetValueSetTree(pid);
    const childNodes = data || [];
    if (pid) {
      const currentNode = findNodeById(treeData.value, pid);
      if (currentNode) {
        currentNode.children = childNodes;
      }
    } else {
      treeData.value = childNodes;
    }
    // Backend returns leafFlag for each child node to determine expandability
    if (resolve) {
      resolve(childNodes);
    }
  } catch {
    ElMessage.error($t('page.manage.valueSet.loadChildrenError'));
    resolve([]);
  } finally {
    stopLoading();
  }
}

// Handle tree node click
async function handleNodeClick(data: Api.SystemManage.ValueSetTree) {
  selectedNodeId.value = data.id;
  isAddMode.value = false;
  isEditMode.value = true;
  await loadValueSetDetails(data.id);
}

// Handle add new (child of selected node or root level)
function handleAdd() {
  isAddMode.value = true;
  isEditMode.value = false;

  // Create new form data with default values
  let parentPath = '';
  if (selectedNodeId.value && formData.value) {
    if (formData.value.parentPath) {
      parentPath = `${formData.value.parentPath}.${formData.value.vsCode}`;
    } else {
      parentPath = formData.value.vsCode || '';
    }
  }

  formData.value = {
    id: 0, // Temporary ID for new item
    vsCode: '',
    vsName: '',
    vsValue: '',
    sort: 0,
    parentPath,
    status: 'enable' as Api.Common.ActiveStatus,
    description: ''
  };
}

// Handle add new root node
function handleAddRoot() {
  selectedNodeId.value = null; // Clear selection
  isAddMode.value = true;
  isEditMode.value = false;

  formData.value = {
    id: 0, // Temporary ID for new item
    vsCode: '',
    vsName: '',
    vsValue: '',
    sort: 0,
    parentPath: '', // Empty for root nodes
    status: 'enable' as Api.Common.ActiveStatus,
    description: ''
  };
}

// Load value set details
async function loadValueSetDetails(id: number) {
  startLoading();
  try {
    const { data } = await fetchGetValueSetById(id);
    formData.value = data ? { ...data } : null;
  } catch {
    ElMessage.error($t('page.manage.valueSet.loadDetailError'));
  } finally {
    stopLoading();
  }
}

// Save form data (both add and edit)
async function handleSave() {
  if (!formData.value) {
    ElMessage.warning($t('page.manage.valueSet.pleaseSelectNode'));
    return;
  }

  try {
    await formRef.value?.validate();
    startLoading();

    const saveData = {
      vsCode: formData.value.vsCode || '',
      vsName: formData.value.vsName || '',
      vsValue: formData.value.vsValue || '',
      sort: formData.value.sort || 0,
      parentPath: formData.value.parentPath || '',
      status: formData.value.status!,
      description: formData.value.description || ''
    };

    if (isAddMode.value) {
      // Add new value set using create API
      // Include parent node id if there's a selected parent
      const requestData = selectedNodeId.value
        ? { ...saveData, parentValueSet: { id: selectedNodeId.value } }
        : saveData;

      await addValueSet(requestData);
      ElMessage.success($t('common.addSuccess'));

      // Store parent node id for refreshing
      const parentNodeId = selectedNodeId.value;

      // Reset form state - clear form but keep it visible
      initializeDefaultForm();
      selectedNodeId.value = null;

      // Refresh parent node's children if adding to a parent, otherwise refresh root
      if (parentNodeId && treeRef.value) {
        // Find the parent node and refresh its children
        const parentNode = treeRef.value.getNode(parentNodeId);
        if (parentNode) {
          // Set the parent node as not loaded to force refresh
          parentNode.loaded = false;
          parentNode.expand();
          updateNodeInTree(treeData.value, parentNodeId, {
            leafFlag: false
          });
        }
      } else {
        // If adding root node, reload entire tree
        await treeRef.value.load();
      }
    } else if (isEditMode.value && selectedNodeId.value) {
      // Update existing value set using update API
      // For updates, we need to determine the parent from the current data
      await updateValueSet({ ...saveData, id: selectedNodeId.value });
      ElMessage.success($t('common.updateSuccess'));

      // Update the specific node in the tree without full refresh
      updateNodeInTree(treeData.value, selectedNodeId.value, {
        vsName: formData.value.vsName,
        vsCode: formData.value.vsCode
      });

      // Clear form but keep it visible
      loadValueSetDetails(selectedNodeId.value);
    }

    // Tree refresh is handled in the add operation above
  } catch {
    const errorMsg = isAddMode.value ? $t('page.manage.valueSet.addError') : $t('page.manage.valueSet.updateError');
    ElMessage.error(errorMsg);
  } finally {
    stopLoading();
  }
}

// Reset form
function handleReset() {
  if (selectedNodeId.value) {
    loadValueSetDetails(selectedNodeId.value);
  }
}

// Handle delete value set
async function handleDelete(node: Api.SystemManage.ValueSetTree) {
  try {
    await ElMessageBox.confirm($t('common.confirmDelete'), $t('common.warning'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning'
    });

    startLoading();
    await deleteSingleValueSet(node.id);
    ElMessage.success($t('common.deleteSuccess'));

    // Reset form if the deleted node was selected
    if (selectedNodeId.value === node.id) {
      selectedNodeId.value = null;
      formData.value = null;
      isEditMode.value = false;
      isAddMode.value = false;
    }

    // Reload tree data to reflect changes
    await treeRef.value.load();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error($t('common.error'));
    }
  } finally {
    stopLoading();
  }
}

// Form validation rules
const formRules = {
  vsCode: [
    { required: true, message: $t('page.manage.valueSet.valueSetCodeRequired'), trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9]+$/,
      message: $t('page.manage.valueSet.valueSetCodeFormat'),
      trigger: 'blur'
    }
  ],
  vsName: [{ required: true, message: $t('page.manage.valueSet.displayNameRequired'), trigger: 'blur' }],
  status: [{ required: true, message: $t('page.manage.valueSet.statusRequired'), trigger: 'change' }]
};

// Handle input restriction for vsCode
function handleVsCodeInput(value: string) {
  if (!value) return '';

  // Filter only letters and numbers (both uppercase and lowercase)
  const filtered = value.replace(/[^A-Za-z0-9]/g, '');

  return filtered;
}

initializeDefaultForm();
</script>

<template>
  <div class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ElCard class="card-wrapper sm:flex-1-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ $t('page.manage.valueSet.title') }}</p>
        </div>
      </template>

      <div class="h-[calc(100%-60px)] flex gap-16px">
        <!-- Left Tree Panel -->
        <div class="w-300px border-r pr-16px">
          <div class="mb-16px flex items-center justify-between">
            <div class="flex">
              <ElButton type="primary" size="small" @click="handleAddRoot">
                {{ $t('page.manage.valueSet.addRoot') }}
              </ElButton>
              <ElButton v-if="selectedNodeId" type="primary" size="small" @click="handleAdd">
                {{ $t('page.manage.valueSet.addChild') }}
              </ElButton>
            </div>
          </div>
          <ElTree
            ref="treeRef"
            v-loading="loading"
            :data="treeData"
            :props="treeProps"
            node-key="id"
            :highlight-current="true"
            :load="loadChildNodes"
            lazy
            class="value-set-tree"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <div class="w-full flex items-center justify-between pr-8px">
                <span class="flex-1">{{ data.vsName }}</span>
                <div v-if="data.leafFlag" class="flex gap-4px">
                  <ElButton type="danger" size="small" text @click.stop="handleDelete(data)">
                    <template #icon>
                      <Delete />
                    </template>
                  </ElButton>
                </div>
              </div>
            </template>
          </ElTree>
        </div>

        <!-- Right Form Panel -->
        <div class="flex-1 pl-16px">
          <div class="mb-16px">
            <h4>{{ $t('page.manage.valueSet.formTitle') }}</h4>
          </div>

          <ElForm
            v-if="formData"
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            class="value-set-form"
          >
            <ElFormItem :label="$t('page.manage.valueSet.valueSetCode')" prop="vsCode">
              <ElInput
                v-model="formData.vsCode"
                :placeholder="$t('page.manage.valueSet.valueSetCodePlaceholder')"
                :readonly="isEditMode"
                maxlength="50"
                @input="(value: string) => { if (formData) formData.vsCode = handleVsCodeInput(value); }"
              />
            </ElFormItem>

            <ElFormItem :label="$t('page.manage.valueSet.displayName')" prop="vsName">
              <ElInput v-model="formData.vsName" :placeholder="$t('page.manage.valueSet.displayNamePlaceholder')" />
            </ElFormItem>

            <ElFormItem :label="$t('page.manage.valueSet.value')" prop="vsValue">
              <ElInput v-model="formData.vsValue" :placeholder="$t('page.manage.valueSet.valuePlaceholder')" />
            </ElFormItem>

            <ElFormItem :label="$t('page.manage.valueSet.sort')">
              <ElInputNumber
                v-model="formData.sort"
                :min="0"
                :placeholder="$t('page.manage.valueSet.sortPlaceholder')"
              />
            </ElFormItem>

            <ElFormItem :label="$t('page.manage.valueSet.parentPath')">
              <ElInput
                v-model="formData.parentPath"
                :placeholder="$t('page.manage.valueSet.parentPathPlaceholder')"
                readonly
              />
            </ElFormItem>

            <ElFormItem :label="$t('page.manage.valueSet.status')" prop="status">
              <ElRadioGroup v-model="formData.status">
                <ElRadio v-for="(label, value) in enableStatusRecord" :key="value" :value="value" :label="$t(label)" />
              </ElRadioGroup>
            </ElFormItem>

            <ElFormItem :label="$t('page.manage.valueSet.description')">
              <ElInput
                v-model="formData.description"
                type="textarea"
                :rows="4"
                :placeholder="$t('page.manage.valueSet.descriptionPlaceholder')"
              />
            </ElFormItem>

            <ElFormItem>
              <ElButton type="primary" :loading="loading" @click="handleSave">
                {{ $t('common.confirm') }}
              </ElButton>
              <ElButton @click="handleReset">
                {{ $t('common.reset') }}
              </ElButton>
            </ElFormItem>
          </ElForm>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.value-set-tree {
  max-height: 500px;
  overflow-y: auto;
}

.value-set-form {
  max-width: 600px;
}

:deep(.el-tree-node__content) {
  height: 36px;
}

:deep(.el-card) {
  .card-wrapper {
    height: calc(100vh - 200px);
  }
}
</style>
