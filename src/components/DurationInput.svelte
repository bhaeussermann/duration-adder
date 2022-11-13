<script lang="ts">
import { onMount, createEventDispatcher } from 'svelte';
import type { Duration } from '../common/duration';

export let duration: Duration = { hours: 0, minutes: 0 }

export const focus = () => textBox.focus();

const eventDispatcher = createEventDispatcher();

let textBox: HTMLInputElement;

onMount(() => formatText(duration));

$: {
  if (!!textBox) {
    formatText(duration);
  }
}

$: hasError = duration.minutes >= 60;

function onKeyDown(event: KeyboardEvent) {
  const isAcceptedKey = event.ctrlKey || event.metaKey
    || ['Backspace', 'Delete', 'Tab'].includes(event.code)
    || (event.key >= '0' && event.key <= '9');
  if (!isAcceptedKey) {
    event.preventDefault();
  }
}

function onSelectionChange(event: Event) {
  const isSelectionEmpty = textBox.selectionStart === textBox.selectionEnd;
  if (isSelectionEmpty) {
    event.preventDefault();
    const lastCharacterPosition = textBox.value.length === 0 ? 0 : textBox.value.length - 1;
    textBox.setSelectionRange(lastCharacterPosition, lastCharacterPosition);
  }
}

function onInput() {
  parseText(textBox.value);
  formatText(duration);
  eventDispatcher('changed');
}

function parseText(text: string) {
  if (!text.length) {
    duration = { hours: 0, minutes: 0 };
  } else {
    const digits = text.replace(/[^\d]/g, '');
    duration = {
      hours: digits.length > 2 ? parseInt(digits.substring(0, digits.length - 2)) : 0,
      minutes: parseInt(digits.substring(Math.max(0, digits.length - 2)))
    };
  }
}

function formatText(duration: Duration) {
  if (!(duration.hours + duration.minutes)) {
    textBox.value = '';
  } else {
    textBox.value = !duration.hours ? duration.minutes + 'm' : `${duration.hours}h ${pad(duration.minutes)}m`;
  }

  function pad(numberToPad: number) {
    return (numberToPad < 10 ? '0' : '') + numberToPad;
  };
}
</script>

<input
  bind:this={textBox}
  type="text"
  placeholder="hh mm"
  maxlength="7"
  class={hasError ? 'error' : ''}
  title={hasError ? 'Invalid duration' : ''}
  on:keydown={onKeyDown}
  on:selectionchange={onSelectionChange}
  on:input={onInput}
  on:blur={() => eventDispatcher('blur')} />

<style lang="scss">
input {
  text-align: right;

  &.error {
    border-color: red;
    outline: none;
  }
}
</style>
