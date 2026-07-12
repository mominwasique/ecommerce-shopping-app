import React from 'react'


const aboutUs = () => {
    
        return (
          <>
            <section className="text-gray-600 body-font">
              <div className="container px-5 py-24 mx-auto">
                {/* About Section */}
                <div className="flex flex-col text-center w-full mb-20">
                  <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">About Our Gallery</h1>
                  <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                    Welcome to our curated art collection showcase. We specialize in presenting unique pieces 
                    that capture moments of beauty and creativity across different artistic styles and mediums.
                  </p>
                </div>
      
                {/* Products Grid */}
                <div className="flex flex-wrap -m-4">
                  <div className="p-4 md:w-1/3">
                    <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                      <img className="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/720x400" alt="Canvas Prints" />
                      <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-3">Canvas Prints</h2>
                        <p className="leading-relaxed mb-3">High-quality canvas prints featuring modern and contemporary artwork. Available in various sizes with premium finishing.</p>
                        <div className="flex items-center flex-wrap">
                          <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">View Collection
                            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"></path>
                              <path d="M12 5l7 7-7 7"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  <div className="p-4 md:w-1/3">
                    <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                      <img className="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/720x400" alt="Framed Photography" />
                      <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-3">Framed Photography</h2>
                        <p className="leading-relaxed mb-3">Professional photography prints in elegant frames. Each piece captures unique moments and perspectives.</p>
                        <div className="flex items-center flex-wrap">
                          <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">View Collection
                            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"></path>
                              <path d="M12 5l7 7-7 7"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  <div className="p-4 md:w-1/3">
                    <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                      <img className="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/720x400" alt="Limited Editions" />
                      <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-3">Limited Editions</h2>
                        <p className="leading-relaxed mb-3">Exclusive limited edition prints signed by artists. Each piece comes with a certificate of authenticity.</p>
                        <div className="flex items-center flex-wrap">
                          <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">View Collection
                            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"></path>
                              <path d="M12 5l7 7-7 7"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      
      
      
      
}

export default aboutUs