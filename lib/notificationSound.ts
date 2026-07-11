let audioContext: AudioContext | null = null

export function playNotificationSound() {
	if (typeof window === 'undefined') return

	try {
		if (!audioContext) {
			audioContext = new (window.AudioContext ||
				(window as any).webkitAudioContext)()
		}

		const ctx = audioContext
		const now = ctx.currentTime

		const oscillator = ctx.createOscillator()
		const gain = ctx.createGain()

		oscillator.type = 'sine'
		oscillator.frequency.setValueAtTime(880, now)
		oscillator.frequency.setValueAtTime(1046, now + 0.08)

		gain.gain.setValueAtTime(0.15, now)
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

		oscillator.connect(gain)
		gain.connect(ctx.destination)

		oscillator.start(now)
		oscillator.stop(now + 0.25)
	} catch {
		// ovoz ijro etilmasa jim o'tkazib yuboramiz
	}
}

export default playNotificationSound