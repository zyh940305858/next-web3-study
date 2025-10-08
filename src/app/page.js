import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

/**
 * 作业导航中心组件
 * 用于在不同周次的作业之间进行导航
 */
export default function HomeworkNavigation() {
  // 作业列表
  const homeworks = [
    { id: "week1-2", title: "第1周 井子格作业", path: "/week1-2" }, // 修改路径为正确的格式
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
          {homeworks.map(homework => (
            <Link
              key={homework.id}
              className={styles.secondary}
              href={homework.path}
            >
              {homework.title}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
