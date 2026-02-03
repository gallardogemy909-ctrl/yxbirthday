/* ========================================
   邢雨欣20岁生日祝福网页脚本
   逐步点击展示版
   ======================================== */

// 祝福语列表
const wishes = [
    "我亲爱的雨欣宝宝，",
    "祝你20岁生日快乐！🎂",
    "在这个特别的日子里，",
    "愿你的每一天都充满阳光和欢笑，",
    "愿你的梦想都能实现，",
    "愿幸福和快乐永远陪伴着你。",
    "20岁，是最美好的年华，",
    "愿你永远保持这份美好与纯真！💕"
];

// 状态变量
let currentStep = 1;
const totalSteps = 6;
let isPlaying = false;
let starsCreated = false;
let currentSong = 1; // 1 = 生日歌, 2 = 稻香

// 歌曲信息
const songs = {
    1: { name: '🎵 生日歌', element: null },
    2: { name: '🎸 添水的吉他弹唱', element: null }
};

// DOM元素
const musicBtn = document.getElementById('musicBtn');
const songNameEl = document.getElementById('songName');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 获取音频元素
    songs[1].element = document.getElementById('song1');
    songs[2].element = document.getElementById('song2');

    // 设置音量
    songs[1].element.volume = 0.7;
    songs[2].element.volume = 0.7;

    // 第一首歌结束后自动切换到第二首
    songs[1].element.addEventListener('ended', () => {
        songs[1].element.pause();
        songs[1].element.currentTime = 0;
        currentSong = 2;
        updateSongDisplay();
        songs[2].element.play().catch(e => console.log('Audio play failed:', e));
    });

    createStars();
    updateStepIndicator();
    updateSongDisplay();
});

// 点击进入下一步
document.addEventListener('click', (e) => {
    // 忽略音乐控制区域的点击
    if (e.target.closest('.music-controls') || e.target.closest('.music-btn') || e.target.closest('.switch-btn')) return;

    // 忽略重新开始按钮的点击
    if (e.target.closest('.restart-btn')) return;

    // 步骤4时点击蛋糕，跳到第5步
    if (currentStep === 4 && e.target.closest('#cake')) {
        blowCandles();
        // 蛋糕点击时的爱心爆发
        createHeartBurst(e.clientX, e.clientY);
        nextStep();
        return;
    }

    // 最后一步时，点击放烟花
    if (currentStep === 6) {
        createFirework(e.clientX, e.clientY);
        createHeartBurst(e.clientX, e.clientY);
        return;
    }

    // 前几步点击时也有小烟花效果（增加互动性）
    if (currentStep >= 1 && currentStep <= 5) {
        // 小型烟花效果
        createClickSparkle(e.clientX, e.clientY);
    }

    // 其他步骤点击进入下一步
    nextStep();
});

// 进入下一步
function nextStep() {
    if (currentStep >= totalSteps) return;

    // 第一步点击时开始播放音乐
    if (currentStep === 1 && !isPlaying) {
        toggleMusic();
    }

    // 隐藏当前步骤
    const currentElement = document.getElementById(`step${currentStep}`);
    currentElement.classList.remove('step-active');

    // 增加步骤
    currentStep++;

    // 显示新步骤
    const nextElement = document.getElementById(`step${currentStep}`);
    nextElement.classList.add('step-active');

    // 更新指示器
    updateStepIndicator();

    // 特殊步骤处理
    if (currentStep === 3) {
        // 开始飘落爱心
        startHearts();
    }

    if (currentStep === 4) {
        // 蛋糕掉落时放烟花
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createFirework(
                        window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                        window.innerHeight / 2 - 100
                    );
                }, i * 200);
            }
        }, 800);
    }

    if (currentStep === 5) {
        // 吹灭蜡烛后的庆祝烟花
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createFirework(
                    Math.random() * window.innerWidth,
                    Math.random() * (window.innerHeight * 0.6)
                );
            }, i * 150);
        }
    }

    if (currentStep === 6) {
        // 开始打字机效果
        setTimeout(typeWriter, 800);
    }
}

// 更新步骤指示器
function updateStepIndicator() {
    const dots = document.querySelectorAll('.step-indicator .dot');
    dots.forEach((dot, index) => {
        if (index < currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 切换音乐播放
function toggleMusic() {
    const currentAudio = songs[currentSong].element;

    if (isPlaying) {
        currentAudio.pause();
        musicBtn.textContent = '🎹 播放音乐';
        musicBtn.classList.remove('playing');
    } else {
        currentAudio.play().catch(e => console.log('Audio play failed:', e));
        musicBtn.textContent = '🎹 暂停音乐';
        musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
}

// 切换歌曲
function switchSong() {
    const wasPlaying = isPlaying;

    // 暂停当前歌曲
    songs[currentSong].element.pause();
    songs[currentSong].element.currentTime = 0;

    // 切换到另一首
    currentSong = currentSong === 1 ? 2 : 1;
    updateSongDisplay();

    // 如果之前在播放，继续播放新歌曲
    if (wasPlaying) {
        songs[currentSong].element.play().catch(e => console.log('Audio play failed:', e));
    }
}

// 更新歌曲显示
function updateSongDisplay() {
    const songNameEl = document.getElementById('songName');
    const guitarHint = document.getElementById('guitarHint');
    if (songNameEl) {
        songNameEl.textContent = songs[currentSong].name;
    }
    if (guitarHint) {
        // 如果当前是生日歌，显示提示切换到吉他弹唱
        if (currentSong === 1) {
            guitarHint.style.display = 'block';
            guitarHint.textContent = '💝 切换听添水的吉他弹唱';
        } else {
            guitarHint.style.display = 'block';
            guitarHint.textContent = '🎵 正在播放：添水为你弹唱的歌 💕';
        }
    }
}

// 吹灭蜡烛效果
function blowCandles() {
    const flames = document.querySelectorAll('#step4 .flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.opacity = '0';
            flame.style.transform = 'translateX(-50%) scale(0)';
            // 创建烟雾
            createSmoke(flame);
        }, index * 200);
    });
}

// 烟雾效果
function createSmoke(flame) {
    const container = document.getElementById('fireworks-container');
    const rect = flame.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        const smoke = document.createElement('div');
        smoke.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            width: 6px;
            height: 6px;
            background: rgba(200, 200, 200, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        container.appendChild(smoke);

        smoke.animate([
            { transform: 'translate(-50%, 0) scale(1)', opacity: 0.6 },
            { transform: `translate(${(Math.random() - 0.5) * 30}px, -50px) scale(4)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });

        setTimeout(() => smoke.remove(), 1500);
    }
}

// 打字机效果 - 自动显示，速度适中
let isTyping = false;

function typeWriter() {
    const element = document.getElementById('typewriter');
    let wishIndex = 0;
    let charIndex = 0;
    let currentText = '';
    isTyping = true;

    const charSpeed = 40; // 每个字40ms，适中的速度
    const lineDelay = 150; // 换行停顿

    function type() {
        if (wishIndex < wishes.length) {
            if (charIndex < wishes[wishIndex].length) {
                currentText += wishes[wishIndex].charAt(charIndex);
                element.textContent = currentText;
                charIndex++;
                setTimeout(type, charSpeed);
            } else {
                currentText += '\n';
                wishIndex++;
                charIndex = 0;
                setTimeout(type, lineDelay);
            }
        } else {
            isTyping = false;
        }
    }

    type();
}

// 开始飘落爱心
let heartInterval;
function startHearts() {
    if (heartInterval) return;
    heartInterval = setInterval(createHeart, 600);
}

// 创建爱心
function createHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.classList.add('heart');

    const hearts = ['💕', '💗', '💓', '🌸', '✨', '🌷', '💖'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = Math.random() * 15 + 12 + 'px';
    heart.style.animationDuration = Math.random() * 5 + 6 + 's';

    container.appendChild(heart);

    setTimeout(() => heart.remove(), 11000);
}

// 创建星星背景
function createStars() {
    if (starsCreated) return;
    starsCreated = true;

    const container = document.getElementById('stars-container');
    const starCount = 60; // 减少星星数量以提升性能
    const colors = ['#fff', '#ffd700', '#ff8fab', '#87ceeb', '#dda0dd'];

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';

        // 随机大小
        const size = Math.random() * 3 + 2;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // 随机颜色（大部分是白色）
        if (Math.random() > 0.7) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            star.style.background = color;
            star.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        }

        container.appendChild(star);
    }
}

// 烟花效果
function createFirework(x, y) {
    const container = document.getElementById('fireworks-container');
    const colors = ['#ff8fab', '#ffd700', '#ff6b9d', '#a77bd4', '#ffb6c1', '#87ceeb', '#ff85a1'];
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 6px ${color}`;
        particle.style.width = '5px';
        particle.style.height = '5px';

        const angle = (Math.PI * 2 / particleCount) * i;
        const velocity = 40 + Math.random() * 70;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0, 0.9, 0.57, 1)'
        });

        container.appendChild(particle);

        setTimeout(() => particle.remove(), 1200);
    }
}

// 点击时的小烟花效果（前几步点击时使用）
function createClickSparkle(x, y) {
    const container = document.getElementById('fireworks-container');
    const colors = ['#ffd700', '#ff8fab', '#a77bd4', '#ff6b9d', '#ffb6c1', '#87ceeb'];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 8;

        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${color} 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 ${size}px ${color};
        `;

        const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5;
        const velocity = 30 + Math.random() * 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 500 + Math.random() * 300,
            easing: 'ease-out'
        });

        container.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// 爱心爆发效果
function createHeartBurst(x, y) {
    const container = document.getElementById('fireworks-container');
    const hearts = ['💕', '💖', '💗', '💓', '🌸'];
    const count = 10;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const angle = (Math.PI * 2 / count) * i;
        const velocity = 50 + Math.random() * 40;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${16 + Math.random() * 10}px;
            pointer-events: none;
            z-index: 1000;
        `;

        container.appendChild(heart);

        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`, opacity: 0 }
        ], {
            duration: 900,
            easing: 'ease-out'
        });

        setTimeout(() => heart.remove(), 900);
    }
}

// 触摸和拖动支持 - 改进版流畅拖尾效果
let isDragging = false;
let lastTrailTime = 0;
const trailInterval = 25; // 更快的粒子生成

// 创建拖动时的流畅拖尾粒子（更大更明显）
function createTrailParticle(x, y) {
    const container = document.getElementById('fireworks-container');
    const colors = ['#ff8fab', '#ffd700', '#ff6b9d', '#ffb6c1', '#a77bd4', '#87ceeb', '#ff85a1'];

    // 每次创建3个粒子，更明显
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 10 + Math.random() * 15; // 更大的粒子

        // 随机偏移
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;

        particle.style.cssText = `
            position: fixed;
            left: ${x + offsetX}px;
            top: ${y + offsetY}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${color} 0%, ${color}80 40%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}60;
        `;

        container.appendChild(particle);

        // 向下飘落并淡出
        const moveX = (Math.random() - 0.5) * 80;
        const moveY = 40 + Math.random() * 60;

        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 600 + Math.random() * 300,
            easing: 'ease-out'
        });

        setTimeout(() => particle.remove(), 900);
    }
}

// 鼠标拖动
document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.music-controls') || e.target.closest('.restart-btn')) return;
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const now = Date.now();
    if (now - lastTrailTime > trailInterval) {
        createTrailParticle(e.clientX, e.clientY);
        lastTrailTime = now;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 触摸拖动
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.music-controls') || e.target.closest('.restart-btn')) return;
    isDragging = true;

    if (currentStep === 6 && !isTyping) {
        const touch = e.touches[0];
        createFirework(touch.clientX, touch.clientY);
        createHeartBurst(touch.clientX, touch.clientY);
    }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const now = Date.now();
    if (now - lastTrailTime > trailInterval) {
        createTrailParticle(touch.clientX, touch.clientY);
        lastTrailTime = now;
    }
}, { passive: true });

document.addEventListener('touchend', () => {
    isDragging = false;
});

// 页面可见性变化时暂停/恢复音乐
document.addEventListener('visibilitychange', () => {
    const currentAudio = songs[currentSong].element;
    if (document.hidden && isPlaying) {
        currentAudio.pause();
    } else if (!document.hidden && isPlaying) {
        currentAudio.play().catch(e => console.log('Audio play failed:', e));
    }
});

// 重新开始动画
function restartAnimation() {
    // 隐藏当前步骤
    const currentElement = document.getElementById(`step${currentStep}`);
    currentElement.classList.remove('step-active');

    // 重置状态
    currentStep = 1;
    typewriterSpeed = 60; // 重置打字速度
    isTyping = false;
    skipTyping = false;

    // 清除打字机文字
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        typewriter.textContent = '';
    }

    // 重置蜡烛火焰
    const flames = document.querySelectorAll('#step4 .flame');
    flames.forEach(flame => {
        flame.style.opacity = '1';
        flame.style.transform = 'translateX(-50%) scale(1)';
    });

    // 停止爱心飘落
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }

    // 清除爱心容器
    const heartsContainer = document.getElementById('hearts-container');
    heartsContainer.innerHTML = '';

    // 显示第一步
    const firstStep = document.getElementById('step1');
    firstStep.classList.add('step-active');

    // 更新指示器
    updateStepIndicator();

    // 重置音乐到开头
    songs[1].element.currentTime = 0;
    songs[2].element.currentTime = 0;
    currentSong = 1;
    updateSongDisplay();
}
