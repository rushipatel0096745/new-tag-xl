"use client";

import React, { useState, useRef } from "react";

export const DragDropList = () => {
    const [list, setList] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
    const dragItem = useRef();
    const dragOverItem = useRef();

    // Records the index of the item being dragged
    const handleDragStart = (position) => {
        dragItem.current = position;
    };

    // Records the index of the target container
    const handleDragEnter = (position) => {
        dragOverItem.current = position;
    };

    const handleDrop = () => {
        const listCopy = [...list];
        const draggedItemContent = listCopy[dragItem.current];
        // Reorder array: remove and re-insert item
        listCopy.splice(dragItem.current, 1);
        listCopy.splice(dragOverItem.current, 0, draggedItemContent);
        // Reset refs and update state
        dragItem.current = null;
        dragOverItem.current = null;
        setList(listCopy);
    };

    return (
        <div>
            {list.map((item, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragOver={(e) => e.preventDefault()} // Required for drop
                    onDragEnd={handleDrop}
                    style={{ padding: "10px", margin: "5px", background: "lightblue" }}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export default DragDropList;
