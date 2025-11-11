<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import type { PropType } from 'vue';
import { menuItemActionButtonClasses, menuItemButtonClasses, menuItemCheckboxClasses, menuItemClasses, menuItemLabelClasses, menuItemSeparatorClasses } from '../../utils/classLists';

const props = defineProps({
    accesskey: {
        type: String,
        required: false,
        default: ''
    },
    onClick: {
        type: Function as PropType<(payload: PointerEvent) => void>,
        required: false,
        default: () => {}
    },
    separator: {
        type: Boolean,
        required: false,
        default: false
    },
    itemType: {
        type: String,
        required: false,
        default: 'icon'
    },
    icon: {
        type: String,
        required: false
    },
    checked: {
        type: Boolean,
        required: false,
        default: false
    },
    enabled: {
        type: Boolean,
        required: false,
        default: true
    }
});

const keyDownHandler = (e: KeyboardEvent) => {
    if (props.accesskey) {
        const keys = (props.accesskey as string).split('+').map((k: string) => k.toLowerCase().trim());
        const ctrl = keys.includes('ctrl') ? e.ctrlKey : true;
        const shift = keys.includes('shift') ? e.shiftKey : true;
        const alt = keys.includes('alt') ? e.altKey : true;
        const key = keys.find((k: string) => !['ctrl', 'shift', 'alt'].includes(k));
        if (ctrl && shift && alt && key === e.key.toLowerCase()) {
            e.preventDefault();
            onItemClick(e as unknown as PointerEvent);
        }
    }
};

const { accesskey, separator, itemType, icon, enabled } = props;

const itemTypeValue = computed(() => itemType || 'text-only');

const hasAnyDecoration = computed(() => {
    if (itemTypeValue.value === 'icon' && !!icon) {
        return true;
    }

    return itemTypeValue.value !== 'text-only';
})

const onItemClick = (e: PointerEvent) => {
    if (props.enabled && typeof props.onClick === 'function') {
        props.onClick(e);
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
    <li v-if="!separator" :class="[...menuItemClasses, { 'opacity-40 cursor-not-allowed': !enabled }]">
        <a :class="menuItemButtonClasses" @click="onItemClick" :disabled="!enabled || null">
            <span v-if="hasAnyDecoration" :class="menuItemCheckboxClasses">
                <img v-if="!!icon" :src="icon" />
                <template v-else-if="itemTypeValue === 'checkbox' && checked">
                    &#x2713;    
                </template>
            </span>
            <span :class="menuItemLabelClasses">
                <slot></slot>
            </span>
            <span v-if="accesskey" :class="menuItemActionButtonClasses">{{ accesskey }}</span>
        </a>
        <slot name="submenu"></slot>
    </li>
    <li v-else :class="menuItemSeparatorClasses"></li>
</template>    