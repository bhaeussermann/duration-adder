<script lang="ts">
import { onMount } from 'svelte';
import type { Duration } from '../common/duration';

export let duration: Duration = { hours: 0, minutes: 0 }

let textBox: HTMLInputElement;

onMount(() => textBox.focus());

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
    const lastCharacterPosition = textBox.value.length;
    textBox.setSelectionRange(lastCharacterPosition, lastCharacterPosition);
  }
}

function onInput() {
  formatText();

  const parts = textBox.value.split(':');
  duration = parts.length === 1
    ? { hours: 0, minutes: parseInt(parts[0]) }
    : { hours: parseInt(parts[0]), minutes: parseInt(parts[1]) };
}

function formatText() {
  let digits = textBox.value.replace(':', '');
  if ((digits.length === 4) && (digits[0] === '0')) {
    digits = digits.substring(1);
  }
  if (digits.length === 2) {
    digits = '0' + digits;
  }
  textBox.value = digits.length <=2
    ? digits
    : `${digits.substring(0, digits.length - 2)}:${digits.substring(digits.length - 2)}`;
}
</script>

<input
  bind:this={textBox}
  type="text"
  placeholder="hh:mm"
  maxlength="5"
  on:keydown={onKeyDown}
  on:selectionchange={onSelectionChange}
  on:input={onInput} />

<style>
input {
  text-align: right;
}
</style>
