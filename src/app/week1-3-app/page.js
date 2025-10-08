'use client'; // 在App Router中使用React Hooks必须标记为客户端组件

import { useState, useReducer, useContext, useEffect, useCallback, useMemo, useRef, useLayoutEffect, createContext } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// 创建Context用于useContext演示
const ThemeContext = createContext();

// Reducer函数用于useReducer演示
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

/**
 * React Hooks 示例组件 - App Router版本
 * 展示所有主要React Hooks的基础用法
 */
export default function ReactHooksExample() {
  // 1. useState - 状态管理的基础Hook
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  // 2. useReducer - 复杂状态逻辑的管理
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  // 3. useRef - 引用DOM元素或存储可变值
  const inputRef = useRef(null);
  const previousCountRef = useRef(count);
  const timerRef = useRef(null);
  
  // 4. useEffect - 处理副作用（如数据获取、订阅、手动DOM操作）
  useEffect(() => {
    console.log('useEffect: 组件渲染完成');
    previousCountRef.current = count;
    
    // 清理函数 - 组件卸载或重新渲染时执行
    return () => {
      console.log('useEffect: 组件将卸载');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [count]); // 依赖数组 - 只有count改变时才会重新执行
  
  // 5. useLayoutEffect - 同步执行副作用，在DOM变更后、浏览器绘制前执行
  useLayoutEffect(() => {
    console.log('useLayoutEffect: 在浏览器绘制前执行');
    // 可以在这里进行DOM测量等操作
  }, []);
  
  // 6. useMemo - 记忆计算结果，避免不必要的重复计算
  const expensiveCalculation = useMemo(() => {
    console.log('执行昂贵计算...');
    let result = 0;
    for (let i = 0; i < count * 100000; i++) {
      result += i;
    }
    return result;
  }, [count]); // 依赖数组 - 只有count改变时才会重新计算
  
  // 7. useCallback - 记忆回调函数，避免不必要的重新渲染
  const handleIncrement = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // 空依赖数组 - 函数只会创建一次
  
  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);
  
  // 设置定时计数器演示useRef存储可变值
  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('定时器运行中...');
    }, 5000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      <div className={styles.container}>
        <h1 className={styles.heading1}>React Hooks 示例 - App Router</h1>
        
        <div className={styles.section}>
          <h2 className={styles.heading2}>1. useState - 基础状态管理</h2>
          <p>当前计数: {count}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={handleIncrement}>增加计数</button>
            <button className={styles.button} onClick={() => setCount(count - 1)}>减少计数</button>
            <button className={styles.button} onClick={() => setCount(0)}>重置计数</button>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入您的名字"
            className={styles.input}
          />
          <p>您输入的名字: {name}</p>
          <button className={styles.button} onClick={handleFocusInput}>聚焦输入框</button>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.heading2}>2. useReducer - 复杂状态管理</h2>
          <p>Reducer计数: {state.count}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => dispatch({ type: 'increment' })}>增加</button>
            <button className={styles.button} onClick={() => dispatch({ type: 'decrement' })}>减少</button>
            <button className={styles.button} onClick={() => dispatch({ type: 'reset' })}>重置</button>
          </div>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.heading2}>3. useRef - 引用DOM元素和存储值</h2>
          <p>前一次计数值: {previousCountRef.current}</p>
          <p>当前计数值: {count}</p>
          <p>差值: {count - previousCountRef.current}</p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.heading2}>4. useEffect - 副作用处理</h2>
          <p>每次count变化时，useEffect都会执行</p>
          <button className={styles.button} onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? '隐藏详情' : '显示详情'}
          </button>
          
          {showDetails && (
            <div className={styles.details}>
              <p>useEffect在以下情况执行:</p>
              <ul>
                <li>组件首次渲染后</li>
                <li>依赖项(count)变化时</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.heading2}>5. useMemo - 性能优化</h2>
          <p>昂贵计算结果: {expensiveCalculation}</p>
          <p>注意: 只有当count变化时才会重新计算</p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.heading2}>6. useCallback - 记忆回调函数</h2>
          <p>handleIncrement函数被记忆，不会在每次渲染时重新创建</p>
          <CallbackComponent onIncrement={handleIncrement} />
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.heading2}>7. useContext - 上下文共享</h2>
          <ThemeProviderExample />
        </div>
        
        <div className={styles.navigation}>
          <Link href="/">返回主页</Link>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

// 用于演示useCallback的子组件
function CallbackComponent({ onIncrement }) {
  console.log('CallbackComponent渲染');
  return (
    <div>
      <p>子组件接收记忆化的回调函数</p>
      <button className={styles.button} onClick={onIncrement}>增加父组件计数</button>
    </div>
  );
}

// 用于演示useContext的组件
function ThemeProviderExample() {
  const theme = useContext(ThemeContext);
  return (
    <div>
      <p>从Context获取的主题: {theme.theme}</p>
    </div>
  );
}