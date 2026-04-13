import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Eraser, Trash2, Download, MousePointer2, Square, Circle as CircleIcon, Upload, Share2 } from 'lucide-react';
import './FeatureStyles.css';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ffffff');
    const [tool, setTool] = useState('pencil'); // pencil, eraser

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;

        // Handle resizing
        const resize = () => {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = 600;
            // Background grid for brutalist look
            drawGrid(ctx);
        };

        const drawGrid = (context) => {
            context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            context.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 20) {
                context.beginPath();
                context.moveTo(i, 0);
                context.lineTo(i, canvas.height);
                context.stroke();
            }
            for (let i = 0; i < canvas.height; i += 20) {
                context.beginPath();
                context.moveTo(0, i);
                context.lineTo(canvas.width, i);
                context.stroke();
            }
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');

        ctx.strokeStyle = tool === 'eraser' ? '#050505' : color;
        ctx.lineWidth = tool === 'eraser' ? 20 : 3;

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // redraw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
    };

    const fileInputRef = useRef(null);
    const [roomCode, setRoomCode] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const ctx = canvasRef.current.getContext('2d');
                    // Draw image centered, max 300px width/height
                    const maxDim = 300;
                    let w = img.width;
                    let h = img.height;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) { h = (maxDim / w) * h; w = maxDim; }
                        else { w = (maxDim / h) * w; h = maxDim; }
                    }
                    ctx.drawImage(img, (canvasRef.current.width - w) / 2, (canvasRef.current.height - h) / 2, w, h);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const generateCode = () => {
        const code = 'WB-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setRoomCode(code);
        alert(`Your Private Session Code: ${code}\nShare this with your friend to collaborate.`);
    };

    return (
        <div className="whiteboard-container animate-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar - Now standalone */}
            <div className="toolbar-brutal" style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-color)',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`tool-btn ${tool === 'pencil' ? 'active' : ''}`}
                        onClick={() => setTool('pencil')}
                        title="Pencil"
                    >
                        <Pencil size={20} />
                    </button>
                    <button
                        className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                        onClick={() => setTool('eraser')}
                        title="Eraser"
                    >
                        <Eraser size={20} />
                    </button>
                    <div className="divider" style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }} />
                    <div className="color-picker" style={{ display: 'flex', gap: '8px' }}>
                        {['#ffffff', '#a78bfa', '#f472b6', '#4ade80', '#fbbf24'].map(c => (
                            <div
                                key={c}
                                className={`color-swatch ${color === c ? 'active' : ''}`}
                                style={{
                                    backgroundColor: c,
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: color === c ? '2px solid #fff' : '2px solid transparent'
                                }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    <button className="tool-btn" onClick={() => fileInputRef.current.click()} title="Upload Photo">
                        <Upload size={20} />
                    </button>
                    <button className="tool-btn secondary" onClick={generateCode} title="Share Access Code">
                        <Share2 size={20} />
                    </button>
                    <button className="tool-btn" onClick={() => {
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }} title="Clear">
                        <Trash2 size={20} />
                    </button>
                    <button className="tool-btn secondary" title="Download">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="canvas-wrapper" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={(e) => {
                        if (!isDrawing) return;
                        const { offsetX, offsetY } = e.nativeEvent;
                        const ctx = canvasRef.current.getContext('2d');
                        ctx.strokeStyle = tool === 'eraser' ? '#050505' : color;
                        ctx.lineWidth = tool === 'eraser' ? 20 : 3;
                        ctx.lineTo(offsetX, offsetY);
                        ctx.stroke();
                    }}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    style={{ cursor: tool === 'pencil' ? 'crosshair' : 'cell' }}
                />
            </div>

            <footer className="whiteboard-footer" style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: '#888' }}>
                <div className="active-users" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>
                        <span className="dot" style={{ display: 'inline-block', width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', marginRight: '8px' }} />
                        3 Users Solving Equations
                    </span>
                    {roomCode && <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Session: {roomCode}</span>}
                </div>
            </footer>
        </div>
    );
};

export default Whiteboard;
