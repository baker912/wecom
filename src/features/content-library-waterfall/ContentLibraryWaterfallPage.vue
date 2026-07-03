<template>
  <!-- 彻底重构：锁定屏幕，严禁任何形式的越界 -->
  <div class="fixed inset-0 bg-white flex flex-col overflow-hidden select-none touch-none" @click="showRadarTooltip = false">
    
    <!-- 视图切换容器 -->
    <div class="flex-1 relative overflow-hidden touch-auto">
      
      <!-- 视图 A：主列表页 -->
      <div v-if="!showFilterSheet" class="absolute inset-0 flex flex-col bg-gray-50 animate-fade-in">
        <!-- 状态栏物理占位：确保没有任何内容能进到状态栏 -->
        <div class="bg-white shrink-0 h-[env(safe-area-inset-top,44px)] min-h-[44px] w-full z-40"></div>

        <!-- 固定头部 -->
        <header class="bg-white shadow-sm border-b border-gray-100 shrink-0 z-30">
          <div class="h-12 flex items-center justify-between px-4">
            <button type="button" class="p-2 -ml-2 text-gray-800 active:opacity-20" @click="backToHome">
              <ChevronLeft :size="26" />
            </button>
            <div class="text-[17px] font-bold text-gray-900">内容库</div>
            <div class="w-10"></div>
          </div>
          
          <div class="px-4 pb-2.5 flex flex-col gap-2.5">
            <div class="flex items-center gap-2.5">
              <div class="flex-1 bg-gray-100 rounded-xl h-10 px-3 flex items-center gap-2">
                <Search :size="16" class="text-gray-400 shrink-0" />
                <input 
                  v-model="keyword" 
                  type="text" 
                  placeholder="请搜索内容" 
                  class="flex-1 bg-transparent outline-none text-[14px] text-gray-800" 
                />
                <button v-if="keyword" @click="keyword=''" class="p-1 text-gray-400">
                  <X :size="14" />
                </button>
                <div class="h-3 w-px bg-gray-300 mx-0.5"></div>
                <button class="text-[14px] font-bold text-red-600 px-1 active:opacity-20">搜索</button>
              </div>
              <button 
                type="button" 
                class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 active:bg-gray-200 shrink-0" 
                @click="openFilter"
              >
                <Filter :size="18" />
              </button>
            </div>

            <!-- 排序标签 -->
            <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <div class="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-gray-100 text-[11px] text-gray-500 font-bold shrink-0">
                排序: {{ sortMode }}
              </div>
              <div
                v-for="chip in appliedChips"
                :key="chip.key"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-[11px] text-red-600 font-bold border border-red-100 shrink-0"
              >
                {{ chip.value }}
                <button v-if="chip.canDelete" type="button" class="ml-0.5 p-0.5" @click="clearApplied(chip.key)">
                  <X :size="10" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- 列表区：独立滚动 -->
        <main class="flex-1 overflow-y-auto px-3 py-3 scrolling-touch bg-gray-50">
          <!-- 骨架屏 -->
          <div v-if="isLoading" class="columns-2 gap-3">
            <div v-for="i in 8" :key="i" class="mb-3 break-inside-avoid">
              <div class="bg-white rounded-2xl p-2 animate-pulse">
                <div class="w-full h-40 bg-gray-200 rounded-xl mb-3"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- 空态 -->
          <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
            <FolderSearch :size="40" class="text-gray-300 mb-4" />
            <h3 class="text-gray-800 font-bold">未找到相关素材</h3>
            <button @click="resetFilter(); applyFilter(); keyword=''; showOnlyFavorites=false" class="mt-4 px-6 py-2 bg-red-500 text-white rounded-full text-sm">清除所有筛选</button>
          </div>

          <!-- 瀑布流 -->
          <div v-else class="columns-2 gap-3">
            <div v-for="item in filteredItems" :key="item.id" class="mb-3 break-inside-avoid">
              <div class="group bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.96] transition-transform" @click="openDetail(item.id)">
                <!-- 封面图 -->
                <div class="relative w-full overflow-hidden bg-gray-100 min-h-[100px]">
                  <template v-if="item.type === '纯文本'">
                      <!-- 纯文本类型的"文本封面" -->
                      <div class="aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex flex-col justify-center overflow-hidden">
                        <p class="text-[12px] text-gray-500 leading-relaxed line-clamp-6 italic font-medium">
                          {{ item.description || item.title }}
                        </p>
                        <div class="mt-3 pt-3 border-t border-gray-200/50 flex justify-end">
                          <FileText :size="14" class="text-gray-300" />
                        </div>
                      </div>
                    </template>
                    <template v-else-if="item.type === '语音'">
                      <!-- 语音类型的简洁矢量风格封面 -->
                      <div class="aspect-square w-full bg-gray-50 flex flex-col items-center justify-center gap-4">
                        <div class="flex items-center gap-3">
                          <!-- 语音图片 (图标圆圈) -->
                          <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <Mic :size="20" class="text-red-500" />
                          </div>
                          <!-- 声波 (放到右边) -->
                          <div class="flex items-center gap-1">
                            <div class="w-1 h-3 bg-red-200 rounded-full animate-pulse"></div>
                            <div class="w-1 h-5 bg-red-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                            <div class="w-1 h-3 bg-red-200 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                          </div>
                        </div>
                        <span class="text-[10px] text-gray-400 font-bold tracking-wider">语音文件</span>
                      </div>
                    </template>
                    <img 
                      v-else
                    :src="getCoverUrl(item)" 
                    class="w-full h-auto object-cover transition-transform duration-500 group-active:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white text-[10px] flex items-center gap-1">
                    <component :is="contentTypeIcon(item.type)" :size="10" />
                    <span v-if="item.type === '文章' && item.assetCount > 1">{{ item.assetCount }}张</span>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <div class="flex items-center gap-1 text-white text-[10px] font-medium">
                      <Eye :size="10" /> {{ item.viewCount }}
                    </div>
                  </div>
                </div>
                <div class="p-2.5">
                  <h3 class="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2">{{ item.title }}</h3>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 truncate">
                      <div class="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[9px] font-bold shrink-0">{{ item.authorTag }}</div>
                      <span class="text-[10px] text-gray-500 truncate">{{ item.authorName }}</span>
                    </div>
                    <div class="flex items-center gap-0.5 text-[10px] text-gray-400 shrink-0">
                      <Star :size="10" /> {{ item.favCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- 视图 B：全屏筛选页 -->
      <div v-else class="absolute inset-0 flex flex-col bg-white animate-slide-up">
        <!-- 状态栏物理占位 -->
        <div class="bg-white shrink-0 h-[env(safe-area-inset-top,44px)] min-h-[44px] w-full z-40"></div>

        <!-- 固定筛选头部 -->
        <header class="bg-white border-b border-gray-100 shrink-0 z-30">
          <div class="h-12 flex items-center justify-between px-4">
            <button type="button" class="text-[15px] text-gray-500 active:opacity-20 px-2" @click="closeFilter">取消</button>
            <div class="text-[17px] font-bold text-gray-900">筛选</div>
            <button type="button" class="text-[15px] text-red-600 font-bold active:opacity-20 px-2" @click="resetFilter">重置</button>
          </div>
        </header>

        <!-- 滚动选项区 -->
        <div class="flex-1 overflow-y-auto px-5 py-6 space-y-7 hide-scrollbar bg-white">
          <!-- 排序方式 -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1 h-3.5 bg-red-600 rounded-full"></span>
                排序方式
              </h4>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="opt in sortOptions" :key="opt"
                @click="sortDraft = opt"
                :class="['h-10 rounded-xl text-[12px] font-bold transition-all border', sortDraft === opt ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-transparent active:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 内容创作者 (已调整至此处) -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1 h-3.5 bg-red-600 rounded-full"></span>
                内容创作者
              </h4>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="opt in creatorOptions" :key="opt"
                @click="handleFilterClick('内容创作者', opt)"
                :class="['h-10 rounded-xl text-[12px] font-bold transition-all border', filterDraft.creator === opt ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-transparent active:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 所属业务 (仅在厂家素材时展示) -->
          <section v-if="filterDraft.creator === '厂家素材'">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1 h-3.5 bg-red-600 rounded-full"></span>
                所属业务
              </h4>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="opt in businessOptions" :key="opt"
                @click="handleFilterClick('所属业务', opt)"
                :class="['h-10 rounded-xl text-[12px] font-bold transition-all border', filterDraft.business === opt ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-transparent active:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 所属场景 (仅在厂家素材时展示) -->
          <section v-if="filterDraft.creator === '厂家素材'">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1 h-3.5 bg-red-600 rounded-full"></span>
                所属场景
              </h4>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="opt in scenarioMapping[filterDraft.business]" :key="opt"
                @click="handleFilterClick('所属场景', opt)"
                :class="['h-10 rounded-xl text-[12px] font-bold transition-all border', filterDraft.scenario === opt ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-transparent active:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 品质车型特有：所属车系 (仅在厂家素材且业务为品质车型时展示) -->
          <section v-if="filterDraft.creator === '厂家素材' && filterDraft.business === '品质车型'">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1 h-3.5 bg-red-600 rounded-full"></span>
                所属车系
              </h4>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="opt in seriesOptions" :key="opt"
                @click="handleFilterClick('所属车系', opt)"
                :class="['h-10 rounded-xl text-[12px] font-bold transition-all border', filterDraft.series === opt ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-transparent active:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 品质车型特有：所属车型 (仅在厂家素材且业务为品质车型时展示) -->
          <section v-if="filterDraft.creator === '厂家素材' && filterDraft.business === '品质车型'">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1 h-3.5 bg-red-600 rounded-full"></span>
                所属车型
              </h4>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="opt in modelMapping[filterDraft.series]" :key="opt"
                @click="handleFilterClick('所属车型', opt)"
                :class="['h-10 rounded-xl text-[12px] font-bold transition-all border', filterDraft.model === opt ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-transparent active:bg-gray-100']"
              >
                {{ opt }}
              </button>
            </div>
          </section>

          <!-- 内容类型 -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <span class="w-1 h-3.5 bg-red-600 rounded-full"></span>
                内容类型
              </h4>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="opt in contentTypeOptions" :key="opt"
                @click="handleFilterClick('内容类型', opt)"
                :class="['h-12 rounded-xl text-[12px] font-bold transition-all border flex flex-col items-center justify-center gap-0.5', filterDraft.contentType === opt ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-transparent active:bg-gray-100']"
              >
                <span>{{ opt }}</span>
                <span class="text-[9px] opacity-60 font-medium">({{ typeCounts[opt] || 0 }})</span>
              </button>
            </div>
          </section>
        </div>

        <!-- 固定底部按钮 -->
        <footer class="p-4 border-t border-gray-100 bg-white shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,20px))]">
          <button class="w-full h-12 bg-red-600 text-white text-[16px] font-bold rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-red-100" @click="applyFilter">
            查看结果
          </button>
        </footer>
      </div>

    </div>

    <!-- 详情模态框 -->
    <div v-if="showDetail && activeItem" class="fixed inset-0 z-[110] flex flex-col bg-white animate-fade-in overflow-hidden">
      <!-- 视频类型：抖音风格展示 -->
      <template v-if="activeItem.type === '视频'">
        <div class="relative w-full h-full bg-black flex flex-col overflow-hidden">
          <!-- 状态栏物理占位 (白色) -->
          <div class="shrink-0 h-[env(safe-area-inset-top,44px)] min-h-[44px] w-full z-40 bg-white"></div>

          <!-- 顶部操作栏 - 白色背景且调整文字颜色 -->
          <header class="relative h-12 flex items-center px-4 z-50 bg-white border-b border-gray-50">
            <button type="button" class="p-2 -ml-2 text-gray-800 active:opacity-20" @click="closeDetail">
              <ChevronLeft :size="30" />
            </button>
            <div class="flex-1 text-center font-bold text-gray-900">视频详情</div>
            <div class="w-10"></div>
          </header>

          <!-- 视频播放区域 -->
          <div class="absolute inset-0 flex items-center justify-center bg-black" @click="toggleVideoPlay">
            <video 
              ref="videoPlayer"
              class="w-full h-full object-contain" 
              :src="activeItem.videoUrl"
              :poster="activeItem.coverUrl" 
              playsinline
              loop
              preload="auto"
              @play="isVideoPlaying = true"
              @pause="isVideoPlaying = false"
              @error="handleVideoError"
              @waiting="isVideoLoading = true"
              @playing="isVideoLoading = false"
              @canplay="isVideoLoading = false"
            ></video>
            
            <!-- 中间播放按钮 / 加载状态 -->
            <div v-if="!isVideoPlaying || isVideoLoading" class="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity pointer-events-none">
              <!-- 加载中 -->
              <div v-if="isVideoLoading" class="flex flex-col items-center justify-center gap-3">
                <div class="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span class="text-white text-[12px] font-medium drop-shadow-md">加载中...</span>
              </div>
              <!-- 播放按钮 -->
              <div v-else class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play :size="32" class="text-white ml-1.5" fill="currentColor" />
              </div>
            </div>
          </div>

          <!-- 右侧交互按钮 (抖音风格：竖状排列) - 增加整体背景色 -->
          <div class="absolute right-3 bottom-6 flex flex-col items-center gap-6 z-[120] bg-white/10 backdrop-blur-xl px-2.5 py-6 rounded-[28px] border border-white/20 shadow-2xl">
            <!-- 浏览量 -->
            <div class="flex flex-col items-center gap-0.5 text-white pointer-events-none">
              <Eye :size="22" />
              <span class="text-[12px] font-bold leading-none mt-1">{{ activeItem.viewCount }}</span>
            </div>
            <!-- 收藏 -->
            <button class="flex flex-col items-center gap-0.5 transition-all active:scale-90" :class="activeItem.isFavorite ? 'text-red-500' : 'text-white'" @click="handleFavoriteDetail">
              <Star :size="22" :fill="activeItem.isFavorite ? 'currentColor' : 'none'" />
              <span class="text-[12px] font-bold leading-none mt-1">{{ activeItem.favCount }}</span>
            </button>
            <!-- 分享 -->
            <button class="flex flex-col items-center gap-0.5 text-white active:opacity-20 transition-all active:scale-90" @click="openShare">
              <Share2 :size="22" />
              <span class="text-[12px] font-bold leading-none mt-1">{{ activeItem.shareCount }}</span>
            </button>
          </div>

          <!-- 底部内容遮罩 (抖音风格) - 宽度占满 -->
          <div class="absolute bottom-0 left-0 right-0 p-5 pb-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
            <div class="space-y-2 max-w-full pr-14 pointer-events-auto">
              <!-- 发布者信息 -->
              <div class="flex items-center gap-2.5 mb-2.5">
                <div class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold border-2 border-white shadow-lg shrink-0">{{ activeItem.authorTag }}</div>
                <div class="flex flex-col">
                  <span class="text-[16px] font-bold text-white drop-shadow-md">{{ activeItem.authorName }}</span>
                  <span class="text-[11px] text-white/60 font-medium">{{ activeItem.publishedAt }}</span>
                </div>
              </div>
              
              <!-- 标签区域 (视频详情) -->
              <div v-if="detailTags.length > 0" class="flex flex-wrap gap-x-2.5 gap-y-1 mb-2">
                <span v-for="tag in detailTags" :key="tag" class="text-[11px] text-blue-400 font-medium">#{{ tag }}</span>
              </div>
              
              <!-- 标题 -->
              <h2 class="text-[18px] font-bold text-white leading-snug drop-shadow-md">
                {{ activeItem.title }}
              </h2>
              
              <!-- 描述 -->
              <p class="text-[14px] text-white/90 leading-relaxed drop-shadow-sm line-clamp-3 mb-2">
                {{ activeItem.description }}
              </p>

              <!-- 雷达标签 (视频详情) -->
              <div class="relative">
                <div 
                  class="flex items-center gap-1 px-2.5 py-1 rounded-lg backdrop-blur-sm border shadow-sm active:scale-95 active:opacity-80 cursor-pointer transition-all duration-200 group" 
                  :class="activeItem.hasRadar ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 hover:border-green-500/50' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:border-white/20'"
                  @click.stop="showRadarTooltip = !showRadarTooltip"
                >
                  <Target :size="12" class="group-hover:scale-110 transition-transform" />
                  <span class="text-[11px] font-bold">{{ activeItem.hasRadar ? '已配置雷达' : '未配置雷达' }}</span>
                </div>

                <!-- 雷达气泡说明 (视频详情) -->
                <div v-if="showRadarTooltip" class="absolute bottom-full left-0 mb-3 z-[130] animate-fade-in">
                  <div class="bg-slate-900/95 backdrop-blur-xl text-white text-[11px] py-2.5 px-4 rounded-xl shadow-2xl whitespace-nowrap relative border border-white/10 ring-1 ring-black/50">
                    <!-- 小三角 -->
                    <div class="absolute -bottom-1 left-6 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/10"></div>
                    {{ activeItem.hasRadar ? '将以小程序卡片形式发送，支持行为跟踪' : '请前往后台进行雷达配置；' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 普通类型展示 -->
      <template v-else>
        <!-- 状态栏物理占位 -->
        <div class="bg-white shrink-0 h-[env(safe-area-inset-top,44px)] min-h-[44px] w-full z-40"></div>

        <!-- 固定详情头部 -->
        <header class="bg-white border-b border-gray-50 shrink-0">
          <div class="h-12 flex items-center px-4">
            <button type="button" class="p-2 -ml-2 text-gray-800 active:opacity-20" @click="closeDetail">
              <ChevronLeft :size="26" />
            </button>
            <div class="flex-1 text-center font-bold text-gray-900 truncate px-4">内容详情</div>
            <div class="w-10"></div>
          </div>
        </header>

        <!-- 详情滚动区 -->
         <div class="flex-1 overflow-y-auto hide-scrollbar bg-white pb-32">
           <!-- 媒体展示区 -->
           <!-- 文章类型：图片轮播 -->
           <div v-if="activeItem.type === '文章' && carouselImages.length > 0" class="w-full bg-black relative overflow-hidden min-h-[40vh]" @touchstart="stopCarousel" @touchend="startCarousel">
             <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${carouselIndex * 100}%)` }">
               <div v-for="(img, idx) in carouselImages" :key="idx" class="w-full shrink-0">
                 <img :src="img" class="w-full h-auto max-h-[75vh] object-contain" />
               </div>
             </div>
             <!-- 轮播指示器 -->
             <div v-if="carouselImages.length > 1" class="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
               <button
                 v-for="(_, idx) in carouselImages"
                 :key="idx"
                 @click="goToSlide(idx)"
                 :class="`h-1.5 rounded-full transition-all ${carouselIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`"
               />
             </div>
             <!-- 图片计数器 -->
             <div v-if="carouselImages.length > 1" class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-bold">
               {{ carouselIndex + 1 }} / {{ carouselImages.length }}
             </div>
           </div>
           <!-- 其他类型：单图展示 -->
           <div v-else-if="activeItem.type !== '纯文本' && activeItem.type !== '语音'" class="w-full bg-black flex items-center justify-center min-h-[40vh]">
             <img :src="getCoverUrl(activeItem)" class="w-full h-auto max-h-[75vh] object-contain" />
           </div>
 
           <div class="px-5 pt-4 pb-6">
             <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-100">{{ activeItem.authorTag }}</div>
            <div class="flex-1 min-w-0">
              <div class="text-[15px] font-bold text-gray-900 truncate">{{ activeItem.authorName }}</div>
              <div class="text-[12px] text-gray-400 mt-0.5">{{ activeItem.publishedAt }}</div>
            </div>
            <!-- 雷达标签 - 保持原位 -->
            <div class="flex flex-col items-end gap-1.5 shrink-0 ml-4 relative">
              <div 
                class="flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all shadow-sm active:scale-95 active:opacity-80 cursor-pointer group"
                :class="activeItem.hasRadar ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100 hover:border-green-200' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100 hover:border-gray-200'"
                @click.stop="showRadarTooltip = !showRadarTooltip"
              >
                <Target :size="12" class="group-hover:scale-110 transition-transform" />
                <span class="text-[11px] font-bold">{{ activeItem.hasRadar ? '已配置雷达' : '未配置雷达' }}</span>
              </div>

              <!-- 雷达气泡说明 (通用详情) -->
              <div v-if="showRadarTooltip" class="absolute top-full right-0 mt-2 z-[130] animate-fade-in">
                <div class="bg-gray-900/95 backdrop-blur-xl text-white text-[11px] py-2.5 px-4 rounded-xl shadow-2xl whitespace-nowrap relative border border-white/10 ring-1 ring-black/50">
                  <!-- 小三角 -->
                  <div class="absolute -top-1 right-6 w-2 h-2 bg-gray-900 rotate-45 border-t border-l border-white/10"></div>
                  {{ activeItem.hasRadar ? '将以小程序卡片形式发送，支持行为跟踪' : '请前往后台进行雷达配置；' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 标签区域 (普通详情) -->
          <div v-if="detailTags.length > 0" class="flex flex-wrap gap-x-3 gap-y-1.5 mb-2 px-0.5">
            <span v-for="tag in detailTags" :key="tag" class="text-[12px] text-blue-600 font-medium">#{{ tag }}</span>
          </div>

          <h2 class="text-[18px] font-bold text-gray-900 leading-tight mb-4">{{ activeItem.title }}</h2>
          
          
          <div v-if="activeItem.type === '链接' || activeItem.type === '语音' || activeItem.type === '小程序'" class="space-y-4">
            <p v-if="activeItem.description" class="text-[14px] text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{{ activeItem.description }}</p>
            
            <!-- 语音播放器 -->
            <div v-if="activeItem.type === '语音'" class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Mic :size="24" class="text-red-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[14px] font-bold text-gray-900 truncate mb-1.5">奥迪A5L产品介绍.mp3</div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div class="w-1/3 h-full bg-red-600 rounded-full"></div>
                    </div>
                    <span class="text-[10px] text-gray-400 font-mono">00:12 / 00:45</span>
                  </div>
                </div>
                <button 
                  class="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center active:scale-90 transition-transform shrink-0"
                  @click="triggerToast('正在播放语音素材...')"
                >
                  <Play :size="18" class="text-red-600 ml-0.5" fill="currentColor" />
                </button>
              </div>
            </div>

            <!-- 链接区块 -->
            <div v-if="activeItem.type === '链接'" class="bg-gray-50 rounded-2xl p-4 border border-gray-100 active:bg-gray-100 transition-colors" @click="triggerToast('正在打开链接...')">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Link :size="24" class="text-blue-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[14px] font-bold text-gray-900 truncate mb-1">链接地址</div>
                  <div class="text-[11px] text-gray-400 truncate">{{ activeItem.externalUrl || 'https://www.audi.cn' }}</div>
                </div>
                <button class="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-full shadow-sm shrink-0">
                  访问
                </button>
              </div>
            </div>

            <!-- 小程序区块 -->
            <div v-if="activeItem.type === '小程序'" class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div class="space-y-4">
                <div class="flex flex-col gap-1">
                  <span class="text-[12px] text-gray-400">小程序 AppID</span>
                  <span class="text-[14px] font-mono font-bold text-gray-900 break-all">{{ activeItem.appId || 'wx1234567890abcdef' }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[12px] text-gray-400">页面路径</span>
                  <span class="text-[14px] font-mono font-bold text-gray-900 break-all">{{ activeItem.path || '/pages/index/main' }}</span>
                </div>
              </div>
            </div>

            <!-- 小程序提示文案单独盒子 -->
             <div v-if="activeItem.type === '小程序'" class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
               <p class="text-[11px] text-black leading-relaxed">
                 提示：若想了解分享后的卡片样式及小程序跳转是否正常，建议先充分测试确认无误后，再分享给相应的用户。
               </p>
             </div>
          </div>

          <p v-if="activeItem.type !== '小程序' && activeItem.type !== '链接' && activeItem.type !== '语音'" class="text-[14px] text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">{{ activeItem.description || `全新奥迪${activeItem.series}为您带来极致体验。` }}</p>

          <!-- 文件类型特有：附件展示 -->
          <div v-if="activeItem.type === '文件'" class="mt-4">
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 active:bg-gray-100 transition-colors" @click="triggerToast('正在打开预览...')">
              <div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <File :size="24" class="text-blue-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-[14px] font-bold text-gray-900 truncate">{{ activeItem.fileName || '未命名文件.pdf' }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">点击即可预览</div>
              </div>
              <button class="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-full shadow-sm">
                预览
              </button>
            </div>
          </div>
          </div>
        </div>

        <!-- 固定交互底栏 (悬浮胶囊样式：质感优化版) -->
        <div class="fixed bottom-10 right-6 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.05)] border border-white/50 ring-1 ring-black/5 px-7 py-2.5 flex items-center gap-9 z-[120] animate-fade-in transition-transform">
          <!-- 浏览量 -->
          <div class="flex flex-col items-center gap-0.5 text-gray-600">
            <Eye :size="20" class="drop-shadow-sm" />
            <span class="text-[11px] font-bold">{{ activeItem.viewCount }}</span>
          </div>
          <!-- 收藏 -->
          <button class="flex flex-col items-center gap-0.5 transition-all active:scale-90" :class="activeItem.isFavorite ? 'text-red-600' : 'text-gray-600'" @click="handleFavoriteDetail">
            <Star :size="20" :fill="activeItem.isFavorite ? 'currentColor' : 'none'" class="drop-shadow-sm" />
            <span class="text-[11px] font-bold">{{ activeItem.favCount }}</span>
          </button>
          <!-- 分享 -->
          <button class="flex flex-col items-center gap-0.5 text-gray-600 active:opacity-40 active:scale-90 transition-all" @click="openShare">
            <Share2 :size="20" class="drop-shadow-sm" />
            <span class="text-[11px] font-bold">{{ activeItem.shareCount }}</span>
          </button>
        </div>
      </template>
    </div>

    <!-- 悬浮收藏按钮 -->
    <button 
      type="button"
      @click="toggleFavorites"
      :class="[
        'fixed right-3 bottom-8 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 z-[100]',
        showOnlyFavorites ? 'bg-red-600 text-white scale-110' : 'bg-white text-gray-400 border border-gray-100'
      ]"
    >
      <Star :size="20" :fill="showOnlyFavorites ? 'currentColor' : 'none'" />
      
      <!-- 收藏总数角标 -->
      <div v-if="favoriteCount > 0" 
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm animate-fade-in"
        :class="showOnlyFavorites ? 'bg-white text-red-600' : 'bg-red-500 text-white'"
      >
        {{ favoriteCount }}
      </div>
    </button>

    <!-- Toast 提示 -->
    <div v-if="showToast" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-black/80 text-white px-6 py-3 rounded-full text-[14px] font-bold animate-fade-in shadow-xl">
      {{ toastMessage }}
    </div>

    <!-- 分享面板 -->
    <div v-if="showShareSheet" class="fixed inset-0 z-[150] flex items-end animate-fade-in">
      <div class="absolute inset-0 bg-black/40" @click="showShareSheet = false"></div>
      <div class="relative w-full bg-white rounded-t-[32px] h-[75vh] flex flex-col animate-slide-up overflow-hidden">
        <div class="shrink-0 w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4"></div>
        
        <div class="px-6 flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h3 class="text-[18px] font-bold text-gray-900">分享素材</h3>
            <div v-if="activeItem?.hasRadar" class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 animate-fade-in">
              <Smartphone :size="10" />
              <span class="text-[10px] font-bold">小程序承载</span>
            </div>
          </div>
          <button @click="showShareSheet = false" class="text-gray-400 p-1"><X :size="20" /></button>
        </div>

        <div v-if="activeItem" class="flex-1 overflow-y-auto px-6 pb-28 no-scrollbar">
          <!-- 编辑素材区域 (海报类型等) -->
          <div v-if="isEditingShare" class="py-4 space-y-6 animate-fade-in">
            <div class="space-y-2">
              <label class="text-[13px] font-bold text-gray-500">分享标题</label>
              <div class="w-full px-4 py-3 bg-gray-100/50 rounded-xl border border-gray-100 text-[15px] text-gray-500 font-medium">
                {{ editDraft.title }}
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[13px] font-bold text-gray-500">
                海报描述
              </label>
              <textarea 
                v-model="editDraft.description"
                rows="8"
                class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-red-500 focus:bg-white transition-all text-[15px] outline-none resize-none"
                placeholder="请输入海报描述"
              ></textarea>
            </div>
            <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
              <div class="w-1 h-10 bg-blue-500 rounded-full shrink-0"></div>
              <p class="text-[12px] text-blue-700 leading-relaxed font-medium">
                温馨提示：编辑后的内容仅在本次分享中生效，不会修改原始素材。
              </p>
            </div>
          </div>

          <template v-else>
            <!-- 第一部分：当前用户 -->
            <div class="mb-8">
              <h4 class="text-[13px] text-gray-400 font-bold mb-4">分享给当前用户</h4>
              <div 
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl transition-colors"
              >
                <img :src="currentUser.avatar" class="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                <div class="flex-1">
                <div class="flex items-center gap-2">
                  <div class="text-[15px] font-bold text-gray-900">{{ currentUser.name }}</div>
                  <div v-if="activeItem.hasRadar" class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-black uppercase">Mini Program</div>
                </div>
                <div class="text-[12px] text-gray-400 mt-0.5">当前用户</div>
              </div>
                <div class="flex items-center gap-2">
                  <button 
                    v-if="activeItem.type === '纯文本' || activeItem.type === '海报'"
                    class="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-[12px] font-bold rounded-full active:scale-95 transition-all"
                    @click="activeItem.type === '纯文本' ? (showTextEditModal = true) : (isEditingShare = true)"
                  >
                    编辑
                  </button>
                  <button 
                    class="px-4 py-1.5 bg-red-600 text-white text-[12px] font-bold rounded-full active:scale-95 transition-all"
                    @click="handleShareConfirm"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>

            <!-- 第二部分：其它用户清单 -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-[13px] text-gray-400 font-bold">分享给其它用户</h4>
                <button @click="toggleSelectAll" class="text-[13px] text-red-600 font-bold active:opacity-50">
                  {{ isAllSelected ? '取消全选' : '一键全选' }}
                </button>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="cust in otherCustomers" 
                  :key="cust.id"
                  class="flex items-center gap-4 p-4 rounded-2xl border transition-all"
                  :class="selectedCustomerIds.has(cust.id) ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'"
                  @click="toggleCustomerSelection(cust.id)"
                >
                  <div 
                    class="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                    :class="selectedCustomerIds.has(cust.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'"
                  >
                    <Check v-if="selectedCustomerIds.has(cust.id)" :size="12" class="text-white" />
                  </div>
                  <img :src="cust.avatar" class="w-10 h-10 rounded-full" />
                  <div class="flex-1 text-[15px] font-bold text-gray-800">{{ cust.name }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 固定底部操作 -->
        <div v-if="activeItem" class="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-lg border-t border-gray-100 flex items-center gap-4">
          <div v-if="!isEditingShare" class="flex flex-col shrink-0">
            <span class="text-[12px] text-gray-400">已选用户</span>
            <span class="text-[15px] font-bold text-gray-900">
              <span class="text-red-600">{{ selectedCustomerIds.size }}</span> / {{ otherCustomers.length }}
            </span>
          </div>
          <div class="flex-1 flex items-center justify-end gap-3">
            <button 
              v-if="!isEditingShare && (activeItem.type === '纯文本' || activeItem.type === '海报')"
              class="px-6 h-12 rounded-xl font-bold text-[14px] border transition-all active:scale-95"
              :class="selectedCustomerIds.size > 0 ? 'border-gray-200 text-gray-600' : 'border-gray-100 text-gray-300 pointer-events-none'"
              @click="activeItem.type === '纯文本' ? (showTextEditModal = true) : (isEditingShare = true)"
            >
              编辑后再发送
            </button>
            <button 
              class="px-8 h-12 rounded-xl font-bold text-[15px] transition-all flex-1 sm:flex-none"
              :class="(selectedCustomerIds.size > 0 || isEditingShare) ? 'bg-red-600 text-white shadow-lg shadow-red-100 active:scale-[0.98]' : 'bg-gray-100 text-gray-300 pointer-events-none'"
              @click="isEditingShare ? (isEditingShare = false) : handleShareConfirm()"
            >
              {{ isEditingShare ? '完成编辑' : '发送' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 文本编辑弹窗 (针对纯文本类型) -->
    <div v-if="showTextEditModal" class="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTextEditModal = false"></div>
      <div class="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl animate-scale-up">
        <div class="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <h3 class="text-[16px] font-bold text-gray-900">编辑文本内容</h3>
          <button @click="showTextEditModal = false" class="text-gray-400"><X :size="18" /></button>
        </div>
        
        <div class="p-6">
          <div class="space-y-2 mb-6">
            <label class="text-[12px] font-bold text-gray-400 uppercase tracking-wider">标题</label>
            <div class="w-full px-4 py-3 bg-gray-100/50 rounded-xl border border-gray-100 text-[15px] font-bold text-gray-500">
              {{ editDraft.title }}
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[12px] font-bold text-gray-400 uppercase tracking-wider">正文内容</label>
            <textarea 
              v-model="editDraft.description"
              rows="10"
              class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-red-500 focus:bg-white transition-all text-[14px] leading-relaxed outline-none resize-none"
              placeholder="请输入文本内容..."
            ></textarea>
          </div>
        </div>

        <div class="px-6 py-5 bg-gray-50/50 border-t border-gray-50 flex items-center gap-3">
          <button 
            @click="showTextEditModal = false"
            class="flex-1 h-12 rounded-2xl font-bold text-[15px] text-gray-500 bg-white border border-gray-200 active:scale-95 transition-all"
          >
            取消
          </button>
          <button 
            @click="handleShareConfirm"
            class="flex-1 h-12 rounded-2xl font-bold text-[15px] text-white bg-red-600 shadow-lg shadow-red-100 active:scale-95 transition-all"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, Eye, Filter, Play, Search, Share2, Star, X, Layers, FolderSearch, FileText, Link, File, BookOpen, Smartphone, Mic, Image, Check, Target, Type } from 'lucide-vue-next';

type ContentType = '图片' | '纯文本' | '视频' | '文件' | '链接' | '文章' | '小程序' | '语音' | '海报';
type SortMode = '最新发布' | '最多浏览' | '最多收藏';

type ContentItem = {
  id: string;
  title: string;
  coverUrl: string;
  coverImages?: string[]; // 多图轮播（文章类型）
  type: ContentType;
  assetCount: number;
  viewCount: number;
  favCount: number;
  shareCount: number;
  authorName: string;
  authorTag: string;
  business: string;
  scenario: string;
  series: string;
  model: string;
  category: string;
  publishedAt: string;
  isFavorite?: boolean;
  videoUrl?: string;
  fileName?: string;
  externalUrl?: string;
  description?: string;
  appId?: string;
  path?: string;
  hasRadar?: boolean;
};

const router = useRouter();

// 注入更新右侧说明面板的方法
const updateRequirementLogic = inject<(logic: string[]) => void>('updateRequirementLogic');

const keyword = ref('');
const sortMode = ref<SortMode>('最新发布');
const sortDraft = ref<SortMode>(sortMode.value);
const showFilterSheet = ref(false);
const showDetail = ref(false);
const activeItemId = ref<string | null>(null);
const isLoading = ref(false);
const showOnlyFavorites = ref(false);
const toastMessage = ref('');
const showToast = ref(false);
const showShareSheet = ref(false);
const showTextEditModal = ref(false);
const isEditingShare = ref(false);
const editDraft = ref({ title: '', description: '' });
const isVideoPlaying = ref(false);
const isVideoLoading = ref(false);
const videoPlayer = ref<HTMLVideoElement | null>(null);
const showRadarTooltip = ref(false);

// 文章图片轮播
const carouselIndex = ref(0);
const carouselAutoPlay = ref<number | null>(null);

const carouselImages = computed(() => {
  if (!activeItem.value || activeItem.value.type !== '文章') return [];
  return activeItem.value.coverImages || (activeItem.value.coverUrl ? [activeItem.value.coverUrl] : []);
});

const startCarousel = () => {
  if (carouselAutoPlay.value) return;
  carouselAutoPlay.value = window.setInterval(() => {
    if (carouselImages.value.length <= 1) return;
    carouselIndex.value = (carouselIndex.value + 1) % carouselImages.value.length;
  }, 3000);
};

const stopCarousel = () => {
  if (carouselAutoPlay.value) {
    clearInterval(carouselAutoPlay.value);
    carouselAutoPlay.value = null;
  }
};

const goToSlide = (index: number) => {
  carouselIndex.value = index;
};

const favoriteCount = computed(() => {
  return items.value.filter(i => i.isFavorite).length;
});

const typeCounts = computed(() => {
  const counts: Record<string, number> = { '全部': items.value.length };
  items.value.forEach(item => {
    counts[item.type] = (counts[item.type] || 0) + 1;
  });
  return counts;
});

const detailTags = computed(() => {
  if (!activeItem.value) return [];
  const item = activeItem.value;
  const tags: string[] = [item.type];
  if (item.business && item.business !== '全部') tags.push(item.business);
  if (item.scenario && item.scenario !== '全部') tags.push(item.scenario);
  if (item.series && item.series !== '全部') tags.push(item.series);
  if (item.model && item.model !== '全部') tags.push(item.model);
  return tags;
});

const handleVideoError = (e: any) => {
  console.error('Video load failed:', e);
  isVideoLoading.value = false;
  triggerToast('视频加载失败，请检查网络或重试');
};

const toggleVideoPlay = async (e?: Event) => {
  if (e) e.stopPropagation();
  if (!videoPlayer.value) return;
  
  try {
    if (videoPlayer.value.paused) {
      isVideoLoading.value = true;
      videoPlayer.value.muted = false;
      
      await videoPlayer.value.play();
      isVideoPlaying.value = true;
      isVideoLoading.value = false;
    } else {
      videoPlayer.value.pause();
      isVideoPlaying.value = false;
    }
  } catch (err) {
    isVideoLoading.value = false;
    console.error('Video playback failed:', err);
    
    if (err instanceof Error && err.name === 'NotAllowedError') {
      try {
        videoPlayer.value.muted = true;
        await videoPlayer.value.play();
        isVideoPlaying.value = true;
        triggerToast('已为您静音播放，点击可开启声音');
      } catch (retryErr) {
        triggerToast('播放失败，请刷新页面重试');
      }
    } else {
      triggerToast('视频加载失败，请重试');
    }
  }
};

interface Customer {
  id: string;
  name: string;
  avatar: string;
}

const currentUser: Customer = {
  id: 'cur-001',
  name: '张三',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'
};

const otherCustomers = ref<Customer[]>([
  { id: 'c-001', name: '李四', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80' },
  { id: 'c-002', name: '王五', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80' },
  { id: 'c-003', name: '赵六', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&h=100&q=80' },
  { id: 'c-004', name: '钱七', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80' },
  { id: 'c-005', name: '孙八', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80' },
  { id: 'c-006', name: '周九', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80' },
]);

const selectedCustomerIds = ref<Set<string>>(new Set());

const isAllSelected = computed(() => {
  return otherCustomers.value.length > 0 && selectedCustomerIds.value.size === otherCustomers.value.length;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCustomerIds.value.clear();
  } else {
    otherCustomers.value.forEach(c => selectedCustomerIds.value.add(c.id));
  }
};

const toggleCustomerSelection = (id: string) => {
  if (selectedCustomerIds.value.has(id)) {
    selectedCustomerIds.value.delete(id);
  } else {
    selectedCustomerIds.value.add(id);
  }
};

// 素材类型映射逻辑走查表
/**
| 素材类型 | 标题 | 封面图 | 内容 | 其他文件/信息 |
| :--- | :---: | :---: | :---: | :--- |
| 文章 | 有 | 有 | 有 (正文) | - |
| 视频 | 有 | 有 | 有 (描述) | 视频文件 (本地高速) |
| 海报 | 有 | 有 | 有 (描述) | - |
| 纯文本 | 有 | 无 (矢量图) | 有 (文本) | - |
| 图片 | 有 | 有 | 有 (描述) | - |
| 文件 | 有 | 有 | 有 (描述) | 文件附件 (PDF/DOC) |
| 语音 | 有 | 无 (矢量图) | 有 (转文字) | 语音文件 (MP3) |
| 小程序 | 有 | 有 | 有 (描述) | AppID, 页面路径 |
| 链接 | 有 | 有 | 有 (描述) | 链接地址 (URL) |
*/

const filterApplied = ref({
  business: '全部',
  scenario: '全部',
  series: '全部',
  model: '全部',
  creator: '厂家素材',
  contentType: '全部' as '全部' | ContentType
});

const filterDraft = ref({ ...filterApplied.value });

// 选项配置
const businessOptions = ['全部', '品质车型', '品牌种草', '售后服务'];
const sortOptions: SortMode[] = ['最新发布', '最多浏览', '最多收藏'];
const creatorOptions = ['厂家素材', '经销商素材'];
const contentTypeOptions: Array<'全部' | ContentType> = ['全部', '图片', '纯文本', '视频', '文件', '链接', '文章', '小程序', '语音', '海报'];
const scenarioMapping: Record<string, string[]> = {
  '全部': ['全部'],
  '品质车型': ['全部', '车型参数', '外观', '内饰', '核心卖点', '友商对比', '营销海报', '购车权益'],
  '品牌种草': ['全部', '品牌历史', '赛场荣耀', '可靠品质', '灯厂秘籍', 'quattro四驱', '全维安全', '智能科技', '权益政策'],
  '售后服务': ['全部', '服务优势', '用户指南', '用户关爱', '服务承诺2.0', '服务营销']
};
const seriesOptions = ['全部', 'A系列', 'Q系列', '纯电', '旅行车', '高性能'];
const modelMapping: Record<string, string[]> = {
  '全部': ['全部', 'A5L', 'A6L', 'A4L', 'A8L', 'A3', 'A5', 'A7 Sportback', '全新A6L', 'Q3', 'Q5L', 'Q7', 'Q8', 'e-tron GT', 'Q4 e-tron', 'Q5 e-tron', 'A4 Avant', 'A6 Avant', 'RS 4', 'RS 6', 'RS 7', 'R8'],
  'A系列': ['全部', 'A3', 'A4L', 'A5L', 'A6L', 'A7 Sportback', 'A8L', '全新A6L'],
  'Q系列': ['全部', 'Q2L', 'Q3', 'Q3 Sportback', 'Q5L', 'Q5L Sportback', 'Q7', 'Q8'],
  '纯电': ['全部', 'e-tron', 'e-tron GT', 'Q4 e-tron', 'Q5 e-tron'],
  '旅行车': ['全部', 'A4 Avant', 'A4 allroad', 'A6 Avant', 'A6 allroad'],
  '高性能': ['全部', 'S4', 'S5', 'S6', 'S7', 'S8', 'RS 4', 'RS 5', 'RS 6', 'RS 7', 'RS Q8', 'R8']
};

const items = ref<ContentItem[]>([
  {
    id: 'CL-001',
    title: '奥迪A5L 车型参数配置表',
    coverUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=60',
    type: '图片',
    assetCount: 1,
    viewCount: 41,
    favCount: 1,
    shareCount: 0,
    isFavorite: true,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品质车型',
    scenario: '车型参数',
    series: 'A系列',
    model: 'A5L',
    category: '新车上市',
    publishedAt: '2026-04-01'
  },
  {
    id: 'CL-002',
    title: '品牌历史：奥迪百年进取之路',
    coverUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=60',
    coverImages: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    ],
    type: '文章',
    assetCount: 5,
    viewCount: 17,
    favCount: 0,
    shareCount: 0,
    isFavorite: false,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品牌种草',
    scenario: '品牌历史',
    series: '全部',
    model: '全部',
    category: '品牌文化',
    publishedAt: '2026-04-02',
    description: '奥迪的品牌历史可以追溯到19世纪末。从奥古斯特·霍希创立品牌，到四环标志的诞生，奥迪始终秉承"突破科技，启迪未来"的核心理念。在百年的发展历程中，奥迪不仅在赛车场上创造了无数辉煌，更在量产车领域不断推陈出新，将豪华、动力与前瞻科技完美结合。今天，奥迪正全面向电动化转型，开启下一个百年的辉煌篇章。我们将持续为您带来最优质的驾驶体验与服务。'
  },
  {
    id: 'CL-003',
    title: '全新奥迪A5L：进取魅力，触手可及',
    coverUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=60',
    type: '视频',
    assetCount: 1,
    viewCount: 2580,
    favCount: 124,
    shareCount: 45,
    isFavorite: true,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品质车型',
    scenario: '车型介绍',
    series: 'A系列',
    model: 'A5L',
    category: '新车发布',
    publishedAt: '2026-03-30',
    videoUrl: '/assets/videos/audi_promo.mp4',
    hasRadar: true,
    description: '全新奥迪A5L以动感设计重塑经典。搭载quattro四驱系统与矩阵式LED大灯，为您带来前所未有的驾驶乐趣。点击视频，开启您的进取之旅。'
  },
  {
    id: 'CL-004',
    title: '奥迪Q5L 核心卖点解析',
    coverUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=60',
    type: '海报',
    assetCount: 1,
    viewCount: 150,
    favCount: 5,
    shareCount: 0,
    isFavorite: false,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品质车型',
    scenario: '核心卖点',
    series: 'Q系列',
    model: 'Q5L',
    category: '车型介绍',
    hasRadar: true,
    publishedAt: '2026-03-28'
  },
  {
    id: 'CL-005',
    title: '全新奥迪A6L 购车权益汇总',
    coverUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=60',
    type: '链接',
    assetCount: 1,
    viewCount: 96,
    favCount: 3,
    shareCount: 0,
    isFavorite: true,
    authorName: '经销商素材',
    authorTag: '经',
    business: '品质车型',
    scenario: '购车权益',
    series: 'A系列',
    model: '全新A6L',
    category: '购车政策',
    publishedAt: '2026-03-21',
    externalUrl: 'https://www.audi.cn/zh/models/a6/a6l.html',
    description: '全新奥迪A6L不仅在外观设计上进行了全面升级，更在智能驾驶和舒适性配置上达到了新的高度。点击下方链接，了解最全面的购车优惠政策与金融方案。'
  },
  {
    id: 'CL-006',
    title: 'quattro四驱技术深度科普',
    coverUrl: '',
    type: '纯文本',
    assetCount: 1,
    viewCount: 34,
    favCount: 0,
    shareCount: 0,
    isFavorite: false,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品牌种草',
    scenario: 'quattro四驱',
    series: '全部',
    model: '全部',
    category: '技术解析',
    publishedAt: '2026-03-25',
    description: 'quattro全时四驱系统是奥迪的核心技术之一。它通过机械式中央差速器，能够实现前后轴动力的快速分配。在极端路况下，quattro系统能为车辆提供卓越的牵引力和稳定性，确保驾驶者的安全与操控乐趣。'
  },
  {
    id: 'CL-007',
    title: '奥迪官方商城：尊享购物体验',
    coverUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=60',
    type: '小程序',
    assetCount: 1,
    viewCount: 58,
    favCount: 1,
    shareCount: 0,
    isFavorite: false,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '售后服务',
    scenario: '用户关爱',
    series: '全部',
    model: '全部',
    category: '服务活动',
    publishedAt: '2026-03-18',
    appId: 'wx88888888888888',
    path: '/pages/mall/index'
  },
  {
    id: 'CL-008',
    title: 'e-tron GT 智驾演示语音讲解',
    coverUrl: '',
    type: '语音',
    assetCount: 1,
    viewCount: 22,
    favCount: 0,
    shareCount: 0,
    isFavorite: false,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品质车型',
    scenario: '智能科技',
    series: '纯电',
    model: 'e-tron GT',
    category: '科技体验',
    publishedAt: '2026-03-12'
  },
  {
    id: 'CL-009',
    title: '奥迪RS系列 赛场荣耀时刻',
    coverUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=60',
    type: '文件',
    assetCount: 1,
    viewCount: 88,
    favCount: 5,
    shareCount: 0,
    isFavorite: true,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品牌种草',
    scenario: '赛场荣耀',
    series: '高性能',
    model: '全部',
    category: '品牌历史',
    publishedAt: '2026-03-15',
    fileName: 'Audi_RS_Motorsport_History.pdf',
    description: '奥迪RS系列自诞生以来，便与赛车运动紧密相连。本手册详细记录了RS系列在勒芒、DTM等各大赛事中的辉煌战绩与技术演进过程。'
  },
  {
    id: 'CL-010',
    title: '奥迪官网：探索进取科技',
    coverUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=60',
    type: '链接',
    assetCount: 1,
    viewCount: 124,
    favCount: 8,
    shareCount: 2,
    isFavorite: false,
    authorName: '厂家素材',
    authorTag: '厂',
    business: '品牌种草',
    scenario: '智能科技',
    series: '全部',
    model: '全部',
    category: '品牌信息',
    publishedAt: '2026-04-05',
    externalUrl: 'https://www.audi.cn',
    description: '点击进入奥迪官方网站，了解最新车型资讯、前沿科技动态以及品牌进取故事。我们将为您呈现最真实的奥迪世界。'
  }
]);

const activeItem = computed(() => {
  const id = activeItemId.value;
  if (!id) return null;
  return items.value.find(i => i.id === id) || null;
});

const normalize = (s: string) => s.trim().toLowerCase();

const filteredItems = computed(() => {
  const k = normalize(keyword.value);
  const f = filterApplied.value;
  let list = items.value.slice();

  // 收藏筛选优先级最高
  if (showOnlyFavorites.value) {
    list = list.filter(i => i.isFavorite);
  }

  if (k) {
    list = list.filter(i => {
      return [i.title, i.authorName, i.series, i.category, i.type, i.business, i.scenario, i.model].some(x => normalize(String(x)).includes(k));
    });
  }
  if (f.business !== '全部') list = list.filter(i => i.business === f.business);
  if (f.scenario !== '全部') list = list.filter(i => i.scenario === f.scenario);
  if (f.series !== '全部') list = list.filter(i => i.series === f.series);
  if (f.model !== '全部') list = list.filter(i => i.model === f.model);
  if (f.creator !== '全部') list = list.filter(i => i.authorName === f.creator);
  if (f.contentType !== '全部') list = list.filter(i => i.type === f.contentType);

  if (sortMode.value === '最多浏览') {
    list.sort((a, b) => b.viewCount - a.viewCount);
  } else if (sortMode.value === '最多收藏') {
    list.sort((a, b) => b.favCount - a.favCount);
  } else {
    list.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }
  return list;
});

const simulateLoading = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 400);
};

let searchTimeout: any = null;
watch(keyword, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(simulateLoading, 300);
});

const openFilter = () => {
  filterDraft.value = { ...filterApplied.value };
  sortDraft.value = sortMode.value;
  showFilterSheet.value = true;
};

const closeFilter = () => {
  showFilterSheet.value = false;
};

const resetFilter = () => {
  filterDraft.value = {
    business: '全部',
    scenario: '全部',
    series: '全部',
    model: '全部',
    creator: '厂家素材',
    contentType: '全部'
  };
  sortDraft.value = '最新发布';
};

const applyFilter = () => {
  filterApplied.value = { ...filterDraft.value };
  sortMode.value = sortDraft.value;
  closeFilter();
  simulateLoading();
};

const handleFilterClick = (group: string, opt: string) => {
  if (group === '所属业务') {
    filterDraft.value.business = opt;
    filterDraft.value.scenario = '全部'; // 切换业务时重置场景
  }
  else if (group === '所属场景') filterDraft.value.scenario = opt;
  else if (group === '所属车系') {
    filterDraft.value.series = opt;
    filterDraft.value.model = '全部'; // 切换车系时重置车型
  }
  else if (group === '所属车型') filterDraft.value.model = opt;
  else if (group === '内容创作者') filterDraft.value.creator = opt;
  else if (group === '内容类型') filterDraft.value.contentType = opt as any;
};

type AppliedFilterKey = 'business' | 'scenario' | 'series' | 'model' | 'creator' | 'contentType';

const appliedChips = computed(() => {
  const f = filterApplied.value;
  const chips: Array<{ key: AppliedFilterKey; label: string; value: string; canDelete: boolean }> = [];
  
  // 内容创作者作为必选项，展示但不可删除
  chips.push({ key: 'creator', label: '来源', value: f.creator, canDelete: false });
  
  if (f.business !== '全部') chips.push({ key: 'business', label: '业务', value: f.business, canDelete: true });
  if (f.scenario !== '全部') chips.push({ key: 'scenario', label: '场景', value: f.scenario, canDelete: true });
  if (f.series !== '全部') chips.push({ key: 'series', label: '车系', value: f.series, canDelete: true });
  if (f.model !== '全部') chips.push({ key: 'model', label: '车型', value: f.model, canDelete: true });
  if (f.contentType !== '全部') chips.push({ key: 'contentType', label: '类型', value: f.contentType, canDelete: true });
  
  return chips;
});

const clearApplied = (key: AppliedFilterKey) => {
  if (key === 'business') {
    filterApplied.value.business = '全部';
    filterApplied.value.scenario = '全部';
  } else {
    filterApplied.value[key] = '全部';
  }
  filterDraft.value = { ...filterApplied.value };
  simulateLoading();
};

const openDetail = (id: string) => {
  activeItemId.value = id;
  showDetail.value = true;
  carouselIndex.value = 0;
  startCarousel();
  
  // 根据不同类型更新右侧需求原型说明
  if (updateRequirementLogic && activeItem.value) {
    const type = activeItem.value.type;

    if (type === '文章') {
      updateRequirementLogic([
        '字段映射：文章类型素材，封面图对应后台【封面图】，标题对应后台【标题】，内容对应后台【文章正文】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else if (type === '视频') {
      updateRequirementLogic([
        '字段映射：视频类型素材，封面图对应后台上传的【封面图】，标题对应后台配置的【标题】，内容对应后台配置的【描述】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else if (type === '海报') {
      updateRequirementLogic([
        '字段映射：海报类型素材，封面图对应后台【上传图片】，标题对应后台【标题】，内容对应后台【描述】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else if (type === '纯文本') {
      updateRequirementLogic([
        '字段映射：纯文本类型素材，标题对应后台【标题】，内容对应后台【文本内容】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else if (type === '图片') {
      updateRequirementLogic([
        '字段映射：图片类型素材，封面图对应后台【上传图片】，标题对应后台【标题】，内容对应后台【描述】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else if (type === '文件') {
      updateRequirementLogic([
        '字段映射：文件类型素材，封面图对应后台【封面图】，标题对应后台【标题】，内容对应后台【描述】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else if (type === '语音') {
      updateRequirementLogic([
        '字段映射：语音类型素材，标题对应后台配置的【语音标题】，内容对应后台配置的【无】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else if (type === '小程序') {
      updateRequirementLogic([
        '字段映射：小程序类型素材，封面图对应后台【卡片图片】，标题对应后台【标题】，内容对应后台【小程序Appid】和【小程序路径】。',
        '交付说明：小程序类型素材默认承载于小程序内，支持行为追踪。'
      ]);
    } else if (type === '链接') {
      updateRequirementLogic([
        '字段映射：链接类型素材，封面图对应后台【封面图】，标题对应后台【标题】，内容对应后台【描述】，链接地址对应后台【链接地址】。',
        activeItem.value.hasRadar ? '交付说明：该素材已配置雷达，发送给用户时将封装为小程序卡片，用户点击后进入小程序查看，支持全链路行为追踪。' : '交付说明：该素材未配置雷达，发送给用户时以原生消息形式发送。'
      ]);
    } else {
      updateRequirementLogic([]);
    }
  }
};

const closeDetail = () => {
  stopCarousel();
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
  isVideoPlaying.value = false;
  showDetail.value = false;
  setTimeout(() => {
    activeItemId.value = null;
  }, 300);
  // 关闭详情时清空动态说明
  if (updateRequirementLogic) {
    updateRequirementLogic([]);
  }
};

const backToHome = () => {
  router.push('/');
};

const triggerToast = (msg: string) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

const openShare = () => {
  if (!activeItem.value) return;
  editDraft.value = {
    title: activeItem.value.title,
    description: activeItem.value.description || ''
  };
  isEditingShare.value = false;
  showShareSheet.value = true;
};

const handleFavoriteDetail = () => {
  if (!activeItem.value) return;
  
  if (!activeItem.value.isFavorite) {
    activeItem.value.isFavorite = true;
    activeItem.value.favCount++;
    triggerToast('收藏成功');
  } else {
    activeItem.value.isFavorite = false;
    activeItem.value.favCount--;
    triggerToast('已取消收藏');
  }
};

const handleShareConfirm = () => {
  if (!activeItem.value) return;
  
  const count = selectedCustomerIds.value.size || 1;
  const isEdited = editDraft.value.title !== activeItem.value.title || editDraft.value.description !== (activeItem.value.description || '');
  
  activeItem.value.shareCount += count;
  showShareSheet.value = false;
  showTextEditModal.value = false;
  selectedCustomerIds.value.clear();
  isEditingShare.value = false;
  
  triggerToast(`成功分享 ${count} 位好友${isEdited ? ' (已包含编辑内容)' : ''}`);
};

const toggleFavorites = () => {
  showOnlyFavorites.value = !showOnlyFavorites.value;
  simulateLoading();
};

const defaultCoverText = 'https://picsum.photos/seed/text/400/400.jpg';
const defaultCoverFile = 'https://picsum.photos/seed/file/400/400.jpg';
const defaultCoverAudio = 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&h=400&q=60';

const getCoverUrl = (item: ContentItem) => {
  if (item.type === '纯文本') return defaultCoverText;
  if (item.type === '文件') return defaultCoverFile;
  if (item.type === '语音') return defaultCoverAudio;
  return item.coverUrl || 'https://picsum.photos/400/600';
};

const contentTypeIcon = (type: ContentType) => {
  switch (type) {
    case '图片': return Image;
    case '纯文本': return Type;
    case '视频': return Play;
    case '文件': return File;
    case '链接': return Link;
    case '文章': return BookOpen;
    case '小程序': return Smartphone;
    case '语音': return Mic;
    case '海报': return Layers;
    default: return FileText;
  }
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
</style>