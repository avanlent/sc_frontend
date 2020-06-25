<template>
  <a-result status="403" title="Unauthorized" sub-title="Sorry, you are not authorized to access that content or perform that operation.">
    <template #extra>
      <a-button type="primary" @click="$router.push('/')">
        Go Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Unauthorized',
}
</script>