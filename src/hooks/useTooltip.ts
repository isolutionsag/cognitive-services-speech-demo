import { useState } from "react"

const useTooltip = (text: string) => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return {
        text,
        open,
        handleOpen,
        handleClose
    }
}

export default useTooltip