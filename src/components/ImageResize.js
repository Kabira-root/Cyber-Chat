import { ReactCrop } from "react-image-crop"
import { useEffect, useRef, useState } from "react";
import Loading from './preloader/Loading';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageResize({ image, setCroppedImg }) {

    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [croppedImg, setCroppedImg] = useState(null);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });
    const imgRef = useRef();

    useEffect(() => {
        const reader = new FileReader();
        reader.addEventListener('load', () => setImg(reader.result?.toString() || ''));
        reader.readAsDataURL(image);
    });

    async function handleComplete() {
        setLoading(true);
        const res = await getCroppedImage(imgRef.current, crop, 'acrop.jpg');
        await setCroppedImg(res);
        setLoading(false);
        document.querySelector('dialog#crop-container').close();
    }

    function getCroppedImage(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        //setTransform takes args as [horizontal-Scaling, H-Skew, V-Skew, Vertical-scaling, Horizontal-Translation, Vertical-Translation ]
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        //drawImage takes following args -- [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight]
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = fileName;
                    resolve(blob);
                },
                'image/jpeg',
                (image.naturalWidth > 500
                    ? (image.naturalWidth > 1000 ? .2 : .5)
                    : 1
                )
            );
        });
    }

    return (
        <>
            <dialog id='crop-container'>
                {loading && <Loading success={false} loading={true} />}
                {
                    !!img &&
                    <ReactCrop crop={crop} aspect={1 / 1} onChange={c => setCrop(c)} >
                        <img src={img} ref={imgRef} alt="" onLoad={() => document.querySelector('dialog#crop-container').showModal()} />
                    </ReactCrop >
                }
                <button onClick={handleComplete} >Crop image</button>
            </dialog>
        </>
    );

}