<template>
  <div id="about">
    <h1><b>About</b></h1>
    <p>Thank you for visiting my site. This is mainly a personal project I 
      made to help me study Japanese. I couldn't really find a place with 
      flashcards that had 3 sides so I created this. If you see any problems or 
      features you'd like to see, please <a href="mailto:contact.sancard@gmail.com">contact</a> me.</p>
  </div>
</template>

<script>
export default {
  name: 'About',
}
</script>

<style lang="scss" scoped>
#about{
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  p {
    max-width: 600px;
  }
}  
</style>