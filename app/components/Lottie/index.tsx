import { FC } from 'react'
import ReactLottie, { LottieProps } from 'react-lottie'

export const Lottie: FC<LottieProps> = ({ options, ...props }) => (
    <ReactLottie options={{ ...defaultOptions, ...options }} {...props} />
)

const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
}
