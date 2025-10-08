import { useState, useReducer, useContext, useEffect, useCallback, useMemo, useRef, useLayoutEffect, createContext } from 'react';
import Link from 'next/link';

// 创建Context用于useContext演示
const UserContext = createContext();

// Reducer函数用于useReducer演示
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case 'TOGGLE_TODO':
      return state.map(todo => 
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
}

/**
 * React Hooks 示例组件 - Page Router版本
 * 展示所有主要React Hooks的基础用法
 */
export default function ReactHooksPageRouterExample() {
  // 1. useState - 基础状态管理
  const [todoText, setTodoText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 2. useReducer - 复杂状态逻辑的管理
  const [todos, dispatch] = useReducer(todoReducer, []);
  
  // 3. useRef - 引用DOM元素或存储可变值
  const todoInputRef = useRef(null);
  const listRef = useRef(null);
  const renderCountRef = useRef(0);
  
  // 增加渲染计数
  useEffect(() => {
    renderCountRef.current += 1;
  });
  
  // 4. useEffect - 处理副作用
  useEffect(() => {
    // 当组件挂载时聚焦输入框
    todoInputRef.current?.focus();
    
    // 设置页面标题
    document.title = `Todo列表 (${todos.length} 项)`;
    
    // 清理函数
    return () => {
      document.title = 'React Hooks示例';
    };
  }, [todos.length]);
  
  // 5. useLayoutEffect - 在DOM变更后、浏览器绘制前执行
  useLayoutEffect(() => {
    // 当主题改变时更新body的class
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [isDarkMode]);
  
  // 6. useMemo - 记忆计算结果
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);
  
  // 7. useCallback - 记忆回调函数
  const handleAddTodo = useCallback(() => {
    if (todoText.trim()) {
      dispatch({ type: 'ADD_TODO', payload: todoText.trim() });
      setTodoText('');
      todoInputRef.current?.focus();
    }
  }, [todoText]);
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  }, [handleAddTodo]);
  
  // 8. 使用useRef滚动到列表底部
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [todos]);

  return (
    <UserContext.Provider value={{ username: 'React开发者', theme: isDarkMode ? 'dark' : 'light' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#333',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: isDarkMode ? '#00bcd4' : '#0070f3' }}>
          React Hooks 示例 - Page Router
        </h1>
        
        {/* 主题切换按钮 */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 16px',
            backgroundColor: isDarkMode ? '#00bcd4' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          切换{isDarkMode ? '浅色' : '深色'}主题
        </button>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>渲染计数: {renderCountRef.current}</h2>
        </div>
        
        {/* useState 和 useReducer 示例 */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: isDarkMode ? '#444' : '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ color: isDarkMode ? '#00bcd4' : '#0070f3' }}>1. useState & useReducer - Todo列表示例</h2>
          
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
            <input
              ref={todoInputRef}
              type="text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="添加新的todo..."
              style={{
                padding: '8px',
                flex: 1,
                fontSize: '16px',
                backgroundColor: isDarkMode ? '#555' : '#fff',
                color: isDarkMode ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button 
              onClick={handleAddTodo}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              添加
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>总计: {todos.length} 项</span>
            <span>已完成: {completedTodos} 项</span>
          </div>
          
          {/* useMemo示例 - 列表筛选 */}
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            padding: '10px',
            border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
            borderRadius: '4px',
            backgroundColor: isDarkMode ? '#555' : '#fff'
          }} ref={listRef}>
            {todos.length === 0 ? (
              <p style={{ textAlign: 'center', color: isDarkMode ? '#ccc' : '#999' }}>暂无todo项，请添加</p>
            ) : (
              todos.map(todo => (
                <div 
                  key={todo.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: isDarkMode ? '#666' : '#f0f0f0',
                    borderRadius: '4px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                    style={{ marginRight: '10px' }}
                  />
                  <span style={{
                    flex: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? (isDarkMode ? '#aaa' : '#888') : (isDarkMode ? '#fff' : '#333')
                  }}>
                    {todo.text}
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* useContext 示例 */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: isDarkMode ? '#444' : '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ color: isDarkMode ? '#00bcd4' : '#0070f3' }}>2. useContext - 上下文共享示例</h2>
          <UserInfo />
        </div>
        
        {/* useCallback 示例 */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: isDarkMode ? '#444' : '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ color: isDarkMode ? '#00bcd4' : '#0070f3' }}>3. useCallback & useMemo - 性能优化</h2>
          <PerformanceComponent 
            todos={todos} 
            onAddTodo={handleAddTodo} 
          />
        </div>
        
        {/* 返回链接 */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/" style={{ color: isDarkMode ? '#00bcd4' : '#0070f3', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            返回主页
          </Link>
        </div>
      </div>
    </UserContext.Provider>
  );
}

// 用于演示useContext的组件
function UserInfo() {
  const user = useContext(UserContext);
  return (
    <div>
      <p><strong>用户名:</strong> {user.username}</p>
      <p><strong>当前主题:</strong> {user.theme}</p>
    </div>
  );
}

// 用于演示useCallback和useMemo的性能组件
function PerformanceComponent({ todos, onAddTodo }) {
  // 组件重新渲染时打印日志
  console.log('PerformanceComponent渲染');
  
  // 使用useMemo计算统计信息
  const stats = useMemo(() => {
    console.log('计算统计信息...');
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, completionRate };
  }, [todos]);

  return (
    <div>
      <h3>任务统计</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>总任务数: {stats.total}</li>
        <li>已完成: {stats.completed}</li>
        <li>待完成: {stats.pending}</li>
        <li>完成率: {stats.completionRate}%</li>
      </ul>
      <p>注意: 只有当todos变化时，统计信息才会重新计算</p>
    </div>
  );
}