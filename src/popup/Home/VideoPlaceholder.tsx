import { Skeleton } from '@mui/joy';

const VideoPlaceholder: React.FC = () => {
    return(
        <div className='bg-semi-black border border-[#4C4C4C] rounded-md p-4 mb-4 max-h-[13.875rem]'>
        <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.5rem', lineHeight: '2rem', marginBottom: '1rem', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
        <div className="flex items-center gap-4">
            <div>
                <div className="flex gap-2 items-center mb-4">
                    <Skeleton animation="wave" variant="circular" sx={{width: '2rem', aspectRatio: '1', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                    <Skeleton animation="wave" variant="text" sx={{fontSize: '0.875rem', lineHeight: '1.25rem', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                </div>
                <div className="flex gap-2 items-center mb-2">
                    <Skeleton animation="wave" variant="circular" sx={{width: '2rem', aspectRatio: '1', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                    <Skeleton animation="wave" variant="text" sx={{fontSize: '0.875rem', lineHeight: '1.25rem', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                </div>
                <Skeleton animation="wave" variant="text" sx={{fontSize: '0.875rem', lineHeight: '1.25rem', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                <div className="w-[12.5rem] h-1"></div>
                <div className="flex gap-2 mt-4">
                    <Skeleton animation="wave" variant="text" sx={{width: '4rem',fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500, bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
                </div>
            </div>
            <Skeleton animation="wave" variant="rectangular" sx={{height: '8.5rem', bgcolor: '#4C4C4C', '&::before': {bgcolor: '#4C4C4C'}}}/>
        </div>
    </div>
    );
}

export default VideoPlaceholder;