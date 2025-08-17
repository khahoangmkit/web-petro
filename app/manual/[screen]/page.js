
import styles from "./page.module.css";
import ManualScreen from "@/app/components/ManualScreen";

export default function Page({ params }) {

  const { screen } = params;
  return (
    <ManualScreen screen={screen} />
  )
}

export function generateStaticParams() {
  return [
    { screen: 'screen1' },
    { screen: 'screen2' },
    { screen: 'screen3' },
  ];
}