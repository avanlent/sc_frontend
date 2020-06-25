<template>
  <div id="footer">
    <div class="item about"><a href="/about">About</a></div>
    <div class="item contact"><a href="mailto:contact.sancard@gmail.com">contact.sancard@gmail.com</a></div>
    <div class="item copyright"><div><small>&copy; Copyright {{ currentYear }}, SanCard</small></div></div>
  </div>
</template>

<script>
export default {
    name: 'FooterBar',
    computed: {
        currentYear() {
            return (new Date()).getFullYear();
        }
    },
}
</script>

<style lang="scss" scoped>
#footer {
  border-top: 8px solid $base-color;
  background-color: $mid-dark;
  min-height: 85px;

  a, small {
    color: $white;
  }
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1em;
    padding: 10px;
  }
  a, a:visited {
    text-decoration: none;
  }

  /* Desktop */
  @media only screen and (min-width: $mobile-width) {
    & {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
    }
    a, a:visited {
      cursor: pointer;
      transition: color 0.1s ease;
    }
    a:hover {
      color: $highlight-color;
    }
    .about { order: 2 }
    .contact { order: 1 }
    .copyright { order: 3 }
  }
}
</style>