<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ t('contact.title') }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t('contact.formTitle') }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('contact.name') }}
              </label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('contact.email') }}
              </label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('contact.subject') }}
              </label>
              <input
                type="text"
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('contact.message') }}
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="4"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              ></textarea>
            </div>
            
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 transition-colors"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">{{ t('contact.sending') }}</span>
              <span v-else>{{ t('contact.send') }}</span>
            </button>
          </form>
        </div>
        
        <!-- Contact Information -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t('contact.infoTitle') }}</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('contact.emailUs') }}</h3>
              <a href="mailto:contact@teller.eu.org" class="text-blue-600 hover:text-blue-800">
                contact@teller.eu.org
              </a>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('contact.followUs') }}</h3>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-600 hover:text-blue-600">
                  <span class="sr-only">Twitter</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" class="text-gray-600 hover:text-blue-600">
                  <span class="sr-only">GitHub</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('contact.responseTime') }}</h3>
              <p class="text-gray-600">{{ t('contact.responseTimeText') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Form state
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

// Handle form submission
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    // Here you would typically send the form data to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    form.value = { name: '', email: '', subject: '', message: '' }
    // Show success message
  } catch (error) {
    // Handle error
  } finally {
    isSubmitting.value = false
  }
}

// SEO Meta
useSeoMeta({
  title: t('seo.contact.title'),
  description: t('seo.contact.description'),
  keywords: t('seo.contact.keywords'),
  ogTitle: t('seo.contact.ogTitle'),
  ogDescription: t('seo.contact.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.contact.twitterTitle'),
  twitterDescription: t('seo.contact.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(t('seo.contact.structuredData'))
    }
  ]
})
</script> 