<script lang="ts">
    interface Props {
        icon: string;
        title: string;
        text: string;
    }

    let { icon, title, text }: Props = $props();
</script>

<div class="card h-100 flex-fill p-4 rounded">
    <img src={icon} class="card-img-top" alt="icon" />
    <h4>{title}</h4>
    <p class="mb-0">{text}</p>
</div>

<style lang="scss">
    .card {
        background: var(--accent-light);
        border: var(--accent-secondary) 2px solid;

        .card-img-top {
            width: 64px;
            height: 64px;
        }
    }
</style>
