import React from 'react'
import ButtonV2 from '../Components/Buttons/ButtonV2'
import ButtonV1 from '../Components/Buttons/ButtonV1'
import Preview from '../Components/Current/Preview'

const Button = () => {
    return (
        <>
            <div className="flex flex-wrap gap-4 justify-center items-center w-full max-w[1440px] h-screen">
                <Preview
                    el={<ButtonV1 />}
                    installationCmd="npm install @pixa/ui"
                    snippetData="
    import ButtonV1 from '../Components/ui/ButtonV1'

    const App=()=>{

    return(
            <>
                <ButtonV1/>
            </>
        )
    }" />
                <Preview
                    el={<ButtonV2 />}
                    installationCmd="npm install @pixa/ui"
                    snippetData="
    import ButtonV2 from '../Components/ui/ButtonV2'

    const App=()=>{

    return(
            <>
                <ButtonV2/>
            </>
        )
    }" />
                <Preview
                    el={<ButtonV2 />}
                    installationCmd="npm install @pixa/ui"
                    snippetData="
    import ButtonV2 from '../Components/ui/ButtonV2'

    const App=()=>{

    return(
            <>
                <ButtonV2/>
            </>
        )
    }" />
                <Preview
                    el={<ButtonV2 />}
                    installationCmd="npm install @pixa/ui"
                    snippetData="
    import ButtonV2 from '../Components/ui/ButtonV2'

    const App=()=>{

    return(
            <>
                <ButtonV2/>
            </>
        )
    }" />
                <Preview
                    el={<ButtonV2 />}
                    installationCmd="npm install @pixa/ui"
                    snippetData="
    import ButtonV2 from '../Components/ui/ButtonV2'

    const App=()=>{

    return(
            <>
                <ButtonV2/>
            </>
        )
    }" />
                <Preview
                    el={<ButtonV2 />}
                    installationCmd="npm install @pixa/ui"
                    snippetData="
    import ButtonV2 from '../Components/ui/ButtonV2'

    const App=()=>{

    return(
            <>
                <ButtonV2/>
            </>
        )
    }" />
            </div>
        </>
    )
}

export default Button