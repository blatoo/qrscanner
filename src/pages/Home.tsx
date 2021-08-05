import { BarcodeScanner } from "@capacitor-community/barcode-scanner"
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react"
import { scanOutline, stopCircleOutline } from "ionicons/icons"
import { useEffect, useState } from "react"
import "./Home.css"

const Home: React.FC = () => {
  const [err, setErr] = useState<string>()
  const [hideBg, setHideBg] = useState("")

  const [present] = useIonAlert()

  const startScan = async () => {
    BarcodeScanner.hideBackground() // make background of WebView transparent
    setHideBg("hideBg")
    const result = await BarcodeScanner.startScan() // start scanning and wait for a result
    stopScan()

    // if the result has content
    if (result.hasContent) {
      console.log("result is: ", result.content) // log the raw scanned content
      present(result.content!, [{ text: "Ok", role: "cancel" }])
    }
  }

  const stopScan = () => {
    BarcodeScanner.showBackground()
    setHideBg("")
    BarcodeScanner.stopScan()
  }

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await BarcodeScanner.checkPermission({ force: true })

        if (status.granted) {
          return true
        }

        return false
      } catch (error) {
        setErr(error.message)
        console.log(error.message)
      }
    }

    checkPermission()

    return () => {}
  }, [])

  if (err) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>QRScanner</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRow>
            <IonText color="danger">{err}</IonText>
          </IonRow>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QRScanner</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={stopScan} hidden={!hideBg} color="danger">
              <IonIcon icon={stopCircleOutline} slot="start" />
              Stop Scan
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className={hideBg}>
        <IonButton
          hidden={!!hideBg}
          className="center-scan-button"
          onClick={startScan}
        >
          <IonIcon icon={scanOutline} slot="start" />
          Start Scan
        </IonButton>
        <div className="scan-box" hidden={!hideBg}></div>
      </IonContent>
    </IonPage>
  )
}

export default Home
