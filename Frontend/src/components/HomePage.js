import React from 'react'

function HomePage() {
  return (
    <div>
        <h2 className='mt-5 text-xl'> 
            Things Needed to be Displayed in HomePage are : <br/>
                Total No. of Publications: [publications_count] <br/> 
                No. of Journals: [journals_count] <br/>
                No. of Conferences : [conferences_count]
        </h2>
    </div>
  )
}

export default HomePage