
import styles from "./page.module.css";
import ManualScreen from "@/app/components/ManualScreen";
import HomeScreen from "@/app/components/HomeScreen";

export default function Page({ params }) {

  const { screen } = params;
  return (
    <HomeScreen screenIndex={screen} />
  )
}

export function generateStaticParams() {
  return [
    { screen: 'screen1' },
    { screen: 'screen23' },
    { screen: 'screen4' },
    { screen: 'screen5' },
    { screen: 'screen67' },
    { screen: 'screen8' },
    { screen: 'screen9' },
  ];
}