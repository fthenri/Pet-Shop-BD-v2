'use client';


export default function ImageModal({ src, onClose }) {
	if (!src) {
		return null;
	}

	const handleImageClick = (e) => {
		e.stopPropagation();
	};

	return (
		<div id="image-modal" className="image-modal-overlay active" onClick={onClose}>
			<span className="image-modal-close-button" onClick={onClose}>
				&times;
			</span>
			<img
				className="image-modal-content"
				id="modal-image"
				src={src}
				alt="Imagem do gráfico ampliada"
				onClick={handleImageClick} 
			/>
		</div>
	);
}