<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Theme Toggle Button -->
    <button 
      @click="toggleTheme" 
      class="theme-toggle"
      :title="isDark ? '明るいテーマに切り替え' : 'ダークテーマに切り替え'"
    >
      <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>

    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 dark:text-white mb-4">
          🎋 おみくじ 🎋
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          あなたの今日の運勢を占いましょう
        </p>
      </div>

      <div class="max-w-md mx-auto">
        <div class="omikuji-card text-center">
          <div class="mb-8">
            <div class="text-6xl mb-4">
              {{ currentResult?.icon || '🎋' }}
            </div>
            
            <div v-if="isDrawing" class="animate-pulse">
              <div class="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                運勢を占っています...
              </div>
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            </div>
            
            <div v-else-if="currentResult" class="fade-in">
              <h2 class="text-4xl font-bold mb-4" :class="getResultColor(currentResult.name)">
                {{ currentResult.name }}
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ currentResult.message }}
              </p>
            </div>
            
            <div v-else>
              <h2 class="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                おみくじを引いてみましょう
              </h2>
              <p class="text-gray-500 dark:text-gray-400">
                下のボタンを押して運勢を占ってください
              </p>
            </div>
          </div>

          <button 
            @click="drawOmikuji" 
            :disabled="isDrawing"
            class="omikuji-button w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="isDrawing">占い中...</span>
            <span v-else>{{ currentResult ? 'もう一度引く' : 'おみくじを回す' }}</span>
          </button>
        </div>

        <div v-if="history.length > 0" class="mt-8">
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
            これまでの結果
          </h3>
          <div class="space-y-2">
            <div 
              v-for="(result, index) in history.slice().reverse().slice(0, 5)" 
              :key="index"
              class="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 text-sm"
            >
              <span class="flex items-center">
                <span class="mr-2">{{ result.icon }}</span>
                <span :class="getResultColor(result.name)">{{ result.name }}</span>
              </span>
              <span class="text-gray-500 dark:text-gray-400 text-xs">
                {{ formatTime(result.timestamp) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const isDark = ref(false);
    const isDrawing = ref(false);
    const currentResult = ref(null);
    const history = ref([]);

    const omikujiResults = [
      {
        name: '大吉',
        icon: '🌟',
        message: '非常に良い運勢です！何事も積極的に取り組むと良い結果が期待できるでしょう。',
        color: 'text-yellow-500'
      },
      {
        name: '中吉',
        icon: '✨',
        message: '良い運勢です。努力を続けることで、望む結果を得ることができるでしょう。',
        color: 'text-orange-500'
      },
      {
        name: '小吉',
        icon: '🍀',
        message: 'まずまずの運勢です。小さな幸せを大切にすることで運気が上昇します。',
        color: 'text-green-500'
      },
      {
        name: '吉',
        icon: '🌸',
        message: '穏やかな運勢です。今のペースを維持することで安定した日々を過ごせるでしょう。',
        color: 'text-pink-500'
      },
      {
        name: '凶',
        icon: '🌧️',
        message: '注意が必要な時期です。慎重に行動し、周りの人のアドバイスに耳を傾けましょう。',
        color: 'text-blue-500'
      },
      {
        name: '大凶',
        icon: '⚡',
        message: '困難な時期ですが、これを乗り越えることで大きく成長できるでしょう。諦めずに頑張って。',
        color: 'text-purple-500'
      }
    ];

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      updateTheme();
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    };

    const updateTheme = () => {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const drawOmikuji = async () => {
      if (isDrawing.value) return;
      
      isDrawing.value = true;
      
      // Add some suspense with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomIndex = Math.floor(Math.random() * omikujiResults.length);
      const result = {
        ...omikujiResults[randomIndex],
        timestamp: new Date()
      };
      
      currentResult.value = result;
      history.value.push(result);
      
      // Save history to localStorage
      localStorage.setItem('omikuji-history', JSON.stringify(history.value));
      
      isDrawing.value = false;
    };

    const getResultColor = (resultName) => {
      const result = omikujiResults.find(r => r.name === resultName);
      return result ? result.color : 'text-gray-600';
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    onMounted(() => {
      // Load theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
      }
      updateTheme();

      // Load history
      const savedHistory = localStorage.getItem('omikuji-history');
      if (savedHistory) {
        try {
          history.value = JSON.parse(savedHistory).map(item => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }));
        } catch (e) {
          console.error('Failed to load history:', e);
        }
      }
    });

    return {
      isDark,
      isDrawing,
      currentResult,
      history,
      toggleTheme,
      drawOmikuji,
      getResultColor,
      formatTime
    };
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>