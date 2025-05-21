import { Frame } from '@farcaster/frames-js'

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000'

export const frameMetadata = {
	title: 'Executive Onboard',
	description: 'Track your Farcaster achievements',
	image: `${APP_URL}/og-image.png`,
	buttons: [
		{
			label: 'Open App',
			action: 'post_redirect',
		},
	],
	postUrl: `${APP_URL}/api/frame`,
}

export default function FramePage() {
	return (
		<Frame
			metadata={frameMetadata}
			image={frameMetadata.image}
			buttons={frameMetadata.buttons}
			postUrl={frameMetadata.postUrl}
		/>
	)
}
