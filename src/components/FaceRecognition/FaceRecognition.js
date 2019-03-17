import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, box, celebrity, probability }) => {
	const regex = /^http/;
	return (
		<div className='centered ma'>
		{	celebrity !==  '' && probability > 70
			? <div className='white f2'>{`I'm pretty sure it's... ${celebrity}!`} </div>
			: celebrity !==  '' && probability > 50
			? <div className='white f2'>{`I think it's ${celebrity}`} </div>
			: celebrity !==  '' && probability > 30
			? <div className='white f2'>{`I'm not sure but I think it's ${celebrity}, try another one!`}</div>
			: imageUrl !==  '' && imageUrl.match(regex) !== null
			? <div className='white f2'>Try better picture or more familiar personality ;) </div>
			: <div></div>
			}
			<div className='absolute mt5'>
				<img className='mt3' id='inputimage' alt='' src= {imageUrl} width='500px' height='auto' />
				<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
			</div>
		</div>
	)

}

export default FaceRecognition;