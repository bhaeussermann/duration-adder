<script lang="ts">
import DurationInput from '../components/DurationInput.svelte';
import type { Duration } from '../common/duration';

let duration: Duration = { hours: 0, minutes: 0};
</script>

<DurationInput bind:duration={duration} />

<div>Duration: {duration.hours}h {duration.minutes}m</div>
