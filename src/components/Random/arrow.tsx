import Svg, { Polygon } from 'react-native-svg';

export const Arrow = () => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Polygon
                points="50,100 20,0 60,0"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="3"
                transform="rotate(180, 50, 50)"
            />
        </Svg>
    )
}