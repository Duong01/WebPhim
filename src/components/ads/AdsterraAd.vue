<template>
  <div
    ref="adContainer"
    class="adsterra-ad"
    :class="containerClass"
  ></div>
</template>

<script>
export default {

  name: 'AdsterraAd',

  props: {

    code: {
      type: String,
      required: true
    },

    containerClass: {
      type: String,
      default: ''
    }

  },

  data() {
    return {
      createdScripts: [],
      initialized: false
    }
  },

  mounted() {
    this.executeAdCode()
  },

  beforeUnmount() {
    this.destroyAd()
  },

  methods: {

    async executeAdCode() {

      if (
        this.initialized ||
        !this.$refs.adContainer ||
        !this.code
      ) {
        return
      }

      this.initialized = true

      try {

        const temp =
          document.createElement('div')

        temp.innerHTML =
          this.code

        const nodes =
          Array.from(
            temp.childNodes
          )

        for (const node of nodes) {

          if (
            node.nodeType ===
            Node.TEXT_NODE
          ) {

            const text =
              node.textContent?.trim()

            if (text) {

              this.$refs.adContainer
                .appendChild(
                  document.createTextNode(
                    text
                  )
                )

            }

            continue
          }

          if (
            node.nodeName.toLowerCase() ===
            'script'
          ) {

            await this.executeScript(
              node
            )

            continue
          }

          this.$refs.adContainer
            .appendChild(
              node.cloneNode(true)
            )
        }

      } catch (error) {

        console.error(
          'Adsterra error:',
          error
        )

      }
    },


    executeScript(originalScript) {

      return new Promise(
        resolve => {

          const script =
            document.createElement(
              'script'
            )

          Array.from(
            originalScript.attributes
          ).forEach(attr => {

            script.setAttribute(
              attr.name,
              attr.value
            )

          })

          const src =
            originalScript.getAttribute(
              'src'
            )

          if (src) {

            script.onload = () => {
              resolve()
            }

            script.onerror = () => {

              console.error(
                'Adsterra script failed:',
                src
              )

              resolve()
            }

            script.src = src

          } else {

            script.textContent =
              originalScript
                .textContent || ''

            resolve()
          }

          this.$refs.adContainer
            .appendChild(script)

          this.createdScripts.push(
            script
          )
        }
      )
    },


    destroyAd() {

      this.createdScripts.forEach(
        script => {

          try {
            script.remove()
          } catch (e) {
            // ignore
          }

        }
      )

      this.createdScripts = []

      if (
        this.$refs.adContainer
      ) {

        this.$refs.adContainer
          .innerHTML = ''

      }

      this.initialized = false
    }
  }
}
</script>

<style scoped>
.adsterra-ad {
  width: 100%;

  display: flex;

  justify-content: center;

  align-items: center;

  overflow: hidden;

  margin: 16px auto;
}
</style>
