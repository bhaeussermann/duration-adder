<script lang="ts">
import { onMount, createEventDispatcher } from 'svelte';
import { Duration } from '../common/duration';

export let duration = Duration.Zero;

export const focus = () => textBox?.focus();

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

function onFocus() {
  textBox.setSelectionRange(0, textBox.value.length);
}

function onInput(event: Event) {
  parseText(textBox.value, (event as InputEvent).inputType === 'deleteContentBackward');
  formatText(duration);
  eventDispatcher('changed');
}

function parseText(text: string, didDeleteContentBackward: boolean = false) {
  const didRemoveLastCharacter = didDeleteContentBackward && !text.includes('m');
  if (didRemoveLastCharacter) {
    text = text.substring(0, text.length - 1);
  }

  const digits = text.replace(/[^\d]/g, '');
  if (!digits.length) {
    duration = Duration.Zero;
  } else {
    duration = new Duration(
      digits.length > 2 ? parseInt(digits.substring(0, digits.length - 2)) : 0,
      parseInt(digits.substring(Math.max(0, digits.length - 2))));
  }
}

function formatText(duration: Duration) {
  textBox.value = duration.isZero ? '' : duration.toString();
}
</script>

<input
  bind:this={textBox}
  type="text"
  inputmode="numeric"
  placeholder="hh mm"
  maxlength="7"
  class={hasError ? 'error' : ''}
  title={hasError ? 'Invalid duration' : ''}
  on:keydown={onKeyDown}
  on:selectionchange={onSelectionChange}
  on:input={onInput}
  on:focus={onFocus}
  on:blur={() => eventDispatcher('blur')} />

<style lang="scss">
input {
  width: 120px;
  font-size: 1.8em;
  text-align: right;

  &.error {
    border-color: red;
    outline: none;
  }
}
</style>
