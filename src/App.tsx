import { useState, useEffect, useRef } from 'react'
import Snowfall from 'react-snowfall'
import { Moon, Sun, BarChart3, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import './App.css'

function App() {
  const [snowflakeCount, setSnowflakeCount] = useState(150)
  const [speed, setSpeed] = useState<[number, number]>([0.5, 3])
  const [wind, setWind] = useState<[number, number]>([-0.5, 2])
  const [radius, setRadius] = useState<[number, number]>([0.5, 3])
  const [color, setColor] = useState('#cbd5e1')
  const [fps, setFps] = useState(0)
  const [showPerformance, setShowPerformance] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsRef = useRef(0)

  // Управление темной темой через класс на document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    let animationFrameId: number
    
    const measureFPS = () => {
      frameCount.current++
      const currentTime = performance.now()
      const elapsed = currentTime - lastTime.current
      
      if (elapsed >= 1000) {
        fpsRef.current = Math.round((frameCount.current * 1000) / elapsed)
        setFps(fpsRef.current)
        frameCount.current = 0
        lastTime.current = currentTime
      }
      
      animationFrameId = requestAnimationFrame(measureFPS)
    }
    
    animationFrameId = requestAnimationFrame(measureFPS)
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  // Оценка нагрузки на основе параметров
  const estimatedLoad = Math.round(
    (snowflakeCount / 10) + 
    ((speed[1] - speed[0]) * 5) + 
    ((radius[1] - radius[0]) * 2)
  )
  
  const getPerformanceStatus = () => {
    if (fps >= 55) return { status: 'Отлично', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' }
    if (fps >= 45) return { status: 'Хорошо', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' }
    if (fps >= 30) return { status: 'Средне', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
    return { status: 'Низкая', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }
  }

  const perfStatus = getPerformanceStatus()

  // Автоматически меняем цвет снежинок при смене темы
  useEffect(() => {
    if (isDarkMode) {
      setColor('#dee4fd')
    } else {
      setColor('#cbd5e1')
    }
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-300">
      <Snowfall
        snowflakeCount={snowflakeCount}
        speed={speed}
        wind={wind}
        radius={radius}
        color={color}
      />
      
      {/* Переключатель темы */}
      <div className="fixed top-4 left-4 z-20">
        <Button
          variant="outline"
          size="default"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="gap-2 shadow-lg backdrop-blur-sm bg-card/80 border-border/50"
        >
          {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{isDarkMode ? 'Темная' : 'Светлая'}</span>
        </Button>
      </div>
      
      {/* Панель производительности */}
      {showPerformance && (
        <Card className="fixed top-4 right-4 z-20 w-[240px] shadow-lg backdrop-blur-sm bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Производительность</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowPerformance(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">FPS:</span>
              <span className={cn("font-bold", perfStatus.color)}>{fps}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Статус:</span>
              <span className={cn("px-2 py-0.5 rounded text-xs font-medium", perfStatus.bg, perfStatus.color)}>
                {perfStatus.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Снежинок:</span>
              <span className="font-semibold">{snowflakeCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Нагрузка:</span>
              <span className="font-semibold">{estimatedLoad}/100</span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    estimatedLoad < 30 ? 'bg-green-500' :
                    estimatedLoad < 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  )}
                  style={{ width: `${Math.min(estimatedLoad, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!showPerformance && (
        <Button
          variant="outline"
          size="default"
          onClick={() => setShowPerformance(true)}
          className="fixed top-4 right-4 z-20 gap-2 shadow-lg backdrop-blur-sm bg-card/80 border-border/50"
        >
          <BarChart3 className="h-4 w-4" />
          Метрики
        </Button>
      )}
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-foreground mb-4 drop-shadow-lg">
              ❄️ Снегопад
            </h1>
            <p className="text-xl text-muted-foreground drop-shadow-md">
              Демонстрация библиотеки react-snowfall
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Настройки снегопада</CardTitle>
              <CardDescription>
                Настройте параметры снегопада и наблюдайте изменения в реальном времени
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Количество снежинок */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="snowflake-count">
                    Количество снежинок: {snowflakeCount}
                  </Label>
                </div>
                <Slider
                  id="snowflake-count"
                  min={0}
                  max={500}
                  step={1}
                  value={[snowflakeCount]}
                  onValueChange={(value) => setSnowflakeCount(value[0])}
                />
              </div>

              {/* Скорость */}
              <div className="space-y-3">
                <Label>
                  Скорость: [{speed[0].toFixed(1)}, {speed[1].toFixed(1)}]
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Мин</Label>
                    <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={[speed[0]]}
                      onValueChange={(value) => setSpeed([value[0], speed[1]])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Макс</Label>
                    <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={[speed[1]]}
                      onValueChange={(value) => setSpeed([speed[0], value[0]])}
                    />
                  </div>
                </div>
              </div>

              {/* Ветер */}
              <div className="space-y-3">
                <Label>
                  Ветер: [{wind[0].toFixed(1)}, {wind[1].toFixed(1)}]
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Мин</Label>
                    <Slider
                      min={-5}
                      max={5}
                      step={0.1}
                      value={[wind[0]]}
                      onValueChange={(value) => setWind([value[0], wind[1]])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Макс</Label>
                    <Slider
                      min={-5}
                      max={5}
                      step={0.1}
                      value={[wind[1]]}
                      onValueChange={(value) => setWind([wind[0], value[0]])}
                    />
                  </div>
                </div>
              </div>

              {/* Размер */}
              <div className="space-y-3">
                <Label>
                  Размер: [{radius[0].toFixed(1)}, {radius[1].toFixed(1)}]
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Мин</Label>
                    <Slider
                      min={0.5}
                      max={10}
                      step={0.1}
                      value={[radius[0]]}
                      onValueChange={(value) => setRadius([value[0], radius[1]])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Макс</Label>
                    <Slider
                      min={0.5}
                      max={10}
                      step={0.1}
                      value={[radius[1]]}
                      onValueChange={(value) => setRadius([radius[0], value[0]])}
                    />
                  </div>
                </div>
              </div>

              {/* Цвет */}
              <div className="space-y-3">
                <Label htmlFor="color-picker">Цвет снежинок</Label>
                <input
                  id="color-picker"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 rounded-md cursor-pointer border border-input bg-background"
                />
                <p className="text-sm text-muted-foreground">
                  💡 {isDarkMode 
                    ? 'На темном фоне используйте светлые оттенки (белый, голубой) для видимости снежинок'
                    : 'На белом фоне используйте светлые оттенки (серый, голубой) для видимости снежинок'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Код использования</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-x-auto p-4 rounded-md bg-muted border border-border">
{`import Snowfall from 'react-snowfall'

<Snowfall
  snowflakeCount={${snowflakeCount}}
  speed={[${speed[0].toFixed(1)}, ${speed[1].toFixed(1)}]}
  wind={[${wind[0].toFixed(1)}, ${wind[1].toFixed(1)}]}
  radius={[${radius[0].toFixed(1)}, ${radius[1].toFixed(1)}]}
  color="${color}"
/>`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Рекомендации</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Оптимальное количество: 50-150 снежинок</li>
                  <li>Более 300 снежинок может снизить FPS</li>
                  <li>Большой разброс размеров увеличивает нагрузку</li>
                  <li>Высокая скорость требует больше вычислений</li>
                  <li>Целевой FPS: 60 (отлично), 30+ (приемлемо)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
