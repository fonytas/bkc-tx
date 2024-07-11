import '@styles/globals.css'
import type { AppProps } from 'next/app'
import localFont from 'next/font/local'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { CategoryScale, Chart, LinearScale, BarElement, Tooltip } from 'chart.js'

import Layout from '@components/layout'

import { Roboto_Mono } from 'next/font/google'

const roboto_mono = Roboto_Mono({
    weight: ['400', '500', '700'],
    style: ['normal'],
    subsets: ['latin'],
})

const graphik = localFont({
    src: [
        {
            path: '../fonts/GraphikTH-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../fonts/GraphikTH-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../fonts/GraphikTH-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../fonts/GraphikTH-Semibold.ttf',
            weight: '600',
            style: 'normal',
        },
    ],
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
