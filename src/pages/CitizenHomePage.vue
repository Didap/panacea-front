<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { FileText, Upload, Download, Trash2 } from 'lucide-vue-next';
import { documentsApi } from '@/api/documents.api';
import type { DocumentCategory, HealthDocument } from '@/types';
import { errorKey } from '@/lib/error-mapping';

const { t, d } = useI18n();
const confirm = useConfirm();
const toast = useToast();

const docs = ref<HealthDocument[]>([]);
const loading = ref(false);
const showUpload = ref(false);
const submitting = ref(false);

const form = ref({
  title: '',
  category: 'referto' as DocumentCategory,
  notes: '',
  takenAt: null as Date | null,
  file: null as File | null,
});

const categoryOptions = [
  'referto',
  'esame_laboratorio',
  'esame_strumentale',
  'ricetta',
  'lettera_dimissione',
  'certificato',
  'altro',
].map((value) => ({ value: value as DocumentCategory, label: t(`documents.category.${value}`) }));

async function load() {
  loading.value = true;
  try {
    const res = await documentsApi.list();
    docs.value = res.items;
  } finally {
    loading.value = false;
  }
}

function openUpload() {
  form.value = {
    title: '',
    category: 'referto',
    notes: '',
    takenAt: null,
    file: null,
  };
  showUpload.value = true;
}

function onFileSelect(event: { files: File[] }) {
  form.value.file = event.files[0] ?? null;
  if (!form.value.title && form.value.file) {
    form.value.title = form.value.file.name.replace(/\.[^.]+$/, '');
  }
}

async function submitUpload() {
  if (!form.value.file) return;
  submitting.value = true;
  try {
    await documentsApi.upload({
      file: form.value.file,
      title: form.value.title,
      category: form.value.category,
      notes: form.value.notes || undefined,
      takenAt: form.value.takenAt ? form.value.takenAt.toISOString().slice(0, 10) : undefined,
    });
    showUpload.value = false;
    await load();
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    submitting.value = false;
  }
}

async function download(doc: HealthDocument) {
  try {
    const blob = await documentsApi.download(doc.id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  }
}

function remove(doc: HealthDocument) {
  confirm.require({
    message: t('documents.deleteConfirm'),
    acceptLabel: t('common.yes'),
    rejectLabel: t('common.no'),
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await documentsApi.remove(doc.id);
        await load();
      } catch (err) {
        toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
      }
    },
  });
}

onMounted(load);
</script>

<template>
  <Toast />
  <ConfirmDialog />

  <div class="flex items-start justify-between gap-4">
    <div>
      <h1 class="text-3xl font-semibold text-surface-900">{{ t('citizen.home.title') }}</h1>
      <p class="mt-1 max-w-2xl text-surface-500">{{ t('citizen.home.subtitle') }}</p>
    </div>
    <Button :label="t('citizen.home.upload')" icon="" @click="openUpload">
      <template #icon>
        <Upload class="size-4" />
      </template>
    </Button>
  </div>

  <div v-if="loading" class="mt-8 text-surface-500">{{ t('common.loading') }}</div>

  <div
    v-else-if="docs.length === 0"
    class="mt-10 flex flex-col items-center rounded-xl border border-dashed border-surface-300 bg-white p-12 text-center"
  >
    <FileText class="size-10 text-surface-300" />
    <p class="mt-3 max-w-md text-surface-500">{{ t('citizen.home.empty') }}</p>
  </div>

  <ul v-else class="mt-8 grid gap-3">
    <li
      v-for="doc in docs"
      :key="doc.id"
      class="flex items-center gap-4 rounded-lg border border-surface-200 bg-white p-4 shadow-sm"
    >
      <div class="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <FileText class="size-5" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate font-medium text-surface-900">{{ doc.title }}</p>
        <p class="mt-0.5 text-sm text-surface-500">
          {{ t(`documents.category.${doc.category}`) }}
          ·
          {{ t('documents.list.uploadedOn') }} {{ d(doc.createdAt, 'short') }}
          <span v-if="doc.takenAt">
            ·
            {{ t('documents.list.takenOn') }} {{ d(doc.takenAt, 'short') }}
          </span>
        </p>
      </div>
      <div class="flex items-center gap-1">
        <Button text rounded :aria-label="t('documents.actions.download')" @click="download(doc)">
          <template #icon><Download class="size-4" /></template>
        </Button>
        <Button
          text
          rounded
          severity="danger"
          :aria-label="t('documents.actions.delete')"
          @click="remove(doc)"
        >
          <template #icon><Trash2 class="size-4" /></template>
        </Button>
      </div>
    </li>
  </ul>

  <Dialog v-model:visible="showUpload" modal :header="t('citizen.home.uploadDialog.title')" class="w-full max-w-md">
    <form class="space-y-4" @submit.prevent="submitUpload">
      <div>
        <label class="mb-1 block text-sm font-medium" for="upload-file">
          {{ t('citizen.home.uploadDialog.fieldFile') }}
        </label>
        <FileUpload
          mode="basic"
          :auto="false"
          :choose-label="t('citizen.home.uploadDialog.fieldFile')"
          accept="application/pdf,image/*,text/plain"
          :max-file-size="10 * 1024 * 1024"
          @select="onFileSelect"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="title">
          {{ t('citizen.home.uploadDialog.fieldTitle') }}
        </label>
        <InputText id="title" v-model="form.title" required class="w-full" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="category">
          {{ t('citizen.home.uploadDialog.fieldCategory') }}
        </label>
        <Select
          id="category"
          v-model="form.category"
          :options="categoryOptions"
          option-label="label"
          option-value="value"
          class="w-full"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="taken-at">
          {{ t('citizen.home.uploadDialog.fieldTakenAt') }}
        </label>
        <DatePicker id="taken-at" v-model="form.takenAt" date-format="yy-mm-dd" class="w-full" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="notes">
          {{ t('citizen.home.uploadDialog.fieldNotes') }}
        </label>
        <Textarea id="notes" v-model="form.notes" rows="3" class="w-full" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" :label="t('citizen.home.uploadDialog.cancel')" text @click="showUpload = false" />
        <Button
          type="submit"
          :label="t('citizen.home.uploadDialog.submit')"
          :loading="submitting"
          :disabled="!form.file || !form.title"
        />
      </div>
    </form>
  </Dialog>
</template>
