import { Skeleton } from '@mui/joy';

interface VideoPlaceholderParams {
    minimize: boolean
}
const VideoPlaceholder: React.FC<VideoPlaceholderParams> = ({minimize}) => {
    if (minimize) {
        return (
            <div className="bg-semi-black border border-[#A0A0A0] rounded-md px-4 py-1 mb-4 h-[67.19px]">
                <div className="flex gap-4 items-center">
                    <Skeleton animation="wave" variant="circular" sx={{height: "2.75rem", minWidth: "2.75rem", maxWidth: "2.75rem", aspectRatio: '1', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                    <div className='h-12 w-[1px] bg-[#A0A0A0]'></div>
                    <div className="">
                        <Skeleton animation="wave" variant="text" sx={{ fontSize: "1.125rem", lineHeight: "140%", width: "14.68rem", bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'} }}/>
                        <div className="flex gap-1 items-center mt-2">
                            <Skeleton animation="wave" variant="circular" sx={{ width:"14px", height:"11px", borderRadius:"5px", bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'} }}/>
                            <Skeleton animation="wave" variant="text" sx={{ fontSize: "0.5rem", lineHeight: "140%", width: '4rem', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'} }}/>
                        </div>
                    </div>
                    <Skeleton animation="wave" variant="rectangular" sx={{ height: "3rem", flex: "flex-grow", objectFit: "cover", maxWidth: "none", bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'} }}/>
                </div>
            </div>
        );
    }
    return(
        <>
        <div className='bg-semi-black border border-[#A0A0A0] rounded-md px-4 pb-4 pt-2 mb-4 h-[181.98px]'>
            <div className='flex gap-2 justify-between items-center mb-1'>
                <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.5rem', lineHeight: '140%', bgcolor: '#4C4C4C', flex: 'flex-grow', '&::before': {bgcolor: '#4C4C4C'}}}/>
                <Skeleton animation="wave" variant="circular" sx={{width: '1.5rem', aspectRatio: '1', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
            </div>
            <div className="flex items-center gap-6">
                <div>
                    <div className="flex gap-2 items-center mb-4">
                        <Skeleton animation="wave" variant="circular" sx={{width: '1.5rem', height: '1.125rem', borderRadius: "5px", aspectRatio: '1', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                        <Skeleton animation="wave" variant="text" sx={{fontSize: '0.75rem', lineHeight: '140%', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                    </div>
                    <div className="flex gap-2 items-center mb-4">
                        <Skeleton animation="wave" variant="circular" sx={{width: '1.5rem', aspectRatio: '1', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                        <Skeleton animation="wave" variant="text" sx={{fontSize: '0.75rem', lineHeight: '140%', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                    </div>
                    <div className="w-[10.25rem] h-1 my-1"></div>
                    <Skeleton animation="wave" variant="text" sx={{width: '4rem', fontSize: '0.75rem', lineHeight: '140%', fontWeight: 500, bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                </div>
                <Skeleton animation="wave" variant="rectangular" sx={{height: '7.4rem', bgcolor: '#4C4C4C', flex: "flex-grow", objectFit: "cover", maxWidth: "none", '&::before': {bgcolor: '#4C4C4C'}}}/>
            </div>
        </div>
        </>
    );
}

export default VideoPlaceholder;