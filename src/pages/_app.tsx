import '@styles/globals.css'
import type { AppProps } from 'next/app'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { CategoryScale, Chart, LinearScale, BarElement, Tooltip } from 'chart.js'

import { Roboto_Mono } from 'next/font/google'

const roboto_mono = Roboto_Mono({
    weight: ['400', '500', '700'],
    style: ['normal'],
    subsets: ['latin'],
})

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels)

export default function App({ Component, pageProps }: AppProps) {
    return (
        <main className={roboto_mono.className}>
            {/* <Layout> */}
            <Component {...pageProps} />
            {/* </Layout> */}
        </main>
    )
}
