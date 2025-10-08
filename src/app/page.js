'use client';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

/**
 * 作业导航中心组件
 * 用于在不同周次的作业之间进行导航，支持混合路由系统
 */
export default function HomeworkNavigation() {
  const router = useRouter();

  // 作业列表，区分不同的路由系统
  const homeworks = [
    { id: "week1-2", router: 'app', title: "第2周 井子格作业", path: "/week1-2" },
    { id: "week1-3-app", router: 'app', title: "第3周 App Router作业", path: "/week1-3-app" },
    { id: "week1-3-page", router: 'page', title: "第3周 Page Router作业", path: "/week1-3-page" }
    // 可以随时添加更多作业
  ];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1>作业导航中心</h1>
        <p>选择您要查看的作业：</p>
        
        <div className={styles.ctas}>
          {homeworks.map(homework => {
            if (homework.router === 'app') {
              return (
                <Link
                  key={homework.id}
                  className={styles.secondary}
                  href={homework.path}
                >
                  {homework.title}
                </Link>
              )
            } else {
              return (
                <button
                  key={homework.id}
                  className={styles.secondary}
                  onClick={() => router.push(homework.path)}
                >
                  {homework.title}
                </button>
              )
            }
          })}
        </div>
      </main>
    </div>
  );
}
