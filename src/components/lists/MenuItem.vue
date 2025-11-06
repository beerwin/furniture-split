<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { menuItemActionButtonClasses, menuItemButtonClasses, menuItemClasses, menuItemLabelClasses, menuItemSeparatorClasses } from '../../utils/classLists';

const props = defineProps<{
    accesskey?: string
    onClick?: () => void
    separator?: boolean | false
}>();

const keyDownHandler = (e: KeyboardEvent) => {
    if (props.accesskey) {
        const keys = props.accesskey.split('+').map(k => k.toLowerCase().trim());
        const ctrl = keys.includes('ctrl') ? e.ctrlKey : true;
        const shift = keys.includes('shift') ? e.shiftKey : true;
        const alt = keys.includes('alt') ? e.altKey : true;
        const key = keys.find(k => !['ctrl', 'shift', 'alt'].includes(k));
        if (ctrl && shift && alt && key === e.key.toLowerCase()) {
            e.preventDefault();
            if (typeof props.onClick === 'function') {
                props.onClick();
            }
        }
    }
};

onMounted(() => {
    document.querySelector('body')?.addEventListener('keydown', keyDownHandler);
})

onUnmounted(() => {
    document.querySelector('body')?.removeEventListener('keydown', keyDownHandler);
})

</script>

<template>
    <li v-if="!separator" :class="menuItemClasses">
        <a :class="menuItemButtonClasses" @click="onClick">
            <span :class="menuItemLabelClasses">
                <slot></slot>
            </span>
            <span :class="menuItemActionButtonClasses">{{ accesskey }}</span>
        </a>
        <slot name="submenu"></slot>
    </li>
    <li v-else :class="menuItemSeparatorClasses"></li>
</template>    