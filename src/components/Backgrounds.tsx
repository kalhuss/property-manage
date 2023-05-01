import React from "react";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";

// Styling for the background
const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(#ffffff 55%, #e6f2f8);
    overflow: hidden;
    z-index: -10;
`;

// Styling for the element
const Element = styled(animated.div)`
    position: absolute;
    will-change: transform;
`;

// Props for the element
interface ElementProps {
    x: number;
    y: number;
    scale: number;
    src: string;
}

// Function to calculate the parallax effect
const calculateParallax = (
    e: MouseEvent,
    elementX: number,
    elementY: number,
    scale: number
) => {
    const intensity = 0.01; // Lower the number, the more intense the parallax effect
    const offsetX = (e.clientX - window.innerWidth / 2) * intensity * scale;
    const offsetY = (e.clientY - window.innerHeight / 2) * intensity * scale;

    return {
        x: elementX + offsetX,
        y: elementY + offsetY,
    };
};

// Function to generate the elements
const generateElements = (n: number, numRows: number, numCols: number) => {
    const elements = [];
    const cellWidth = window.innerWidth / numCols;
    const cellHeight = window.innerHeight / numRows;
    const occupiedCells: Set<number> = new Set();

    // Generate n elements
    for (let i = 0; i < n; i++) {
        let cellIndex;

        // Generate a random cell index that hasn't been used yet
        do {
            cellIndex = Math.floor(Math.random() * numRows * numCols);
        } while (occupiedCells.has(cellIndex));
        occupiedCells.add(cellIndex);

        // Calculate the x and y coordinates of the element
        const row = Math.floor(cellIndex / numCols);
        const col = cellIndex % numCols;

        // Add some randomness to the coordinates
        const x = col * cellWidth + Math.random() * cellWidth;
        const y = row * cellHeight + Math.random() * cellHeight;
        const scale = 0.5 + Math.random() * 1.5; // Random scale between 0.5 and 2
        const src = `/assets/cloud.svg`; // Cycle through 3 different element images

        // Add the element to the list of elements
        elements.push(
            <AnimatedElement key={i} x={x} y={y} scale={scale} src={src} />
        );
    }

    return elements;
};

// Animated element component
const AnimatedElement: React.FC<ElementProps> = ({ x, y, scale, src }) => {
    const [{ xy }, set] = useSpring(() => ({ xy: [x, y] }));

    // Update the xy value when the mouse moves
    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { x: newX, y: newY } = calculateParallax(e, x, y, scale);
            set({ xy: [newX, newY] });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [set, x, y, scale]);

    // Function to interpolate the transform value
    const interpTransform = (x: number, y: number) =>
        `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

    // Return the animated element
    return (
        <Element
            style={{
                transform: xy.to((x, y) => interpTransform(x, y)),
                backgroundImage: `url(${src})`,
                width: "50px",
                height: "50px",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
            }}
        />
    );
};

// Background component
const Background: React.FC = () => {
    const [elements, setElements] = React.useState<JSX.Element[]>([]);

    React.useEffect(() => {
        setElements(generateElements(9, 3, 3)); // 10 elements in a 5x5 grid
    }, []);

    return <Container>{elements}</Container>;
};

export default Background;
