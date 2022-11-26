import React from 'react'
import "./CheckoutSteps.css"
import { Step, Stepper, Typography ,StepLabel} from '@material-ui/core'
import { Fragment } from 'react'
import { MdAccountBalance, MdLibraryAdd, MdLocalShipping } from 'react-icons/md'

const CheckoutSteps = ({ activeStep }) => {

    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <MdLocalShipping />
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <MdLibraryAdd />
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <MdAccountBalance />

        }
    ]

    const stepStyles = {
        boxSizing: "border-box"
    };

    return (

        <Fragment>
            <Stepper  alternativeLabel activeStep={activeStep} style={stepStyles}>

            {steps.map((item,index)=>(
                <Step key={index} active={activeStep===index?true:false}
                completed={activeStep>=index?true:false}>
                    <StepLabel icon={item.icon} style={{color:activeStep>=index ? "tomato": "rgba(0,0,0,0.649)"}} >
                        {item.label}
                    </StepLabel>


                </Step>
            ))}  
            

            </Stepper>

        </Fragment>
    )
}

export default CheckoutSteps