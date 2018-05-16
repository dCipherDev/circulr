import React from 'react';
import { Input,Button,Form,Select,Slider } from 'antd';
import * as settingsFormatter from 'modules/settings/formatters'
import {configs} from 'common/config/data'

function Trade(props) {
  const {form, settings} = props
  const Option = Select.Option;

  const handleChange = (type, e) => {
    if ('timeToLive' === type || 'lrcFee' === type || 'marginSplit' === type) {
      handleChangeValue(type, e.target.value)
    } else {
      handleChangeValue(type, e)
    }
  }

  const validateLrcFee = (value) => {
    let v = Number(value);
    return value && v.toString() === value && v >=0 && v <=50
  }

  const validateMarginSplit = (value) => {
    let v = Number(value);
    return value && v.toString() === value && v >=0 && v <=100
  }

  const handleChangeValue = (type, v) => {
    if('timeToLive' === type){
      if(settingsFormatter.isValidInteger(v)) {
        settings.tradingChange({[type]:v})
      }
    } else if('timeToLiveUnit' === type) {
      settings.tradingChange({[type]:v})
    } else if ('gasPrice' === type) {
      if (settingsFormatter.isValidInteger(v)) {
        settings.tradingChange({[type]:v})
      }
    } else {
      if (('lrcFee' === type && validateLrcFee(v))
        || ('marginSplit' === type && validateMarginSplit(v))){
        settings.tradingChange({[type]:v})
      }
    }
  }

  const handleReset = () => {
    form.setFieldsValue({timeToLive:configs.defaultExpireTime, timeToLiveUnit:configs.defaultExpireTimeUnit,
      lrcFee:configs.defaultLrcFeePermillage, marginSplit:configs.defaultMarginSplitPercentage, gasPrice:configs.defaultGasPrice})
    handleChangeValue('timeToLive', configs.defaultExpireTime)
    handleChangeValue('timeToLiveUnit', configs.defaultExpireTimeUnit)
    handleChangeValue('lrcFee', configs.defaultLrcFeePermillage)
    handleChangeValue('marginSplit', configs.defaultMarginSplitPercentage)
    handleChangeValue('gasPrice', configs.defaultGasPrice)
  }

  const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
    initialValue:settings.trading.timeToLiveUnit,
    rules:[]
  })(
    <Select style={{ width: 90 }} onChange={handleChange.bind(this, "timeToLiveUnit")}>
      <Option value="minute">minute</Option>
      <Option value="hour">hour</Option>
      <Option value="day">day</Option>
      <Option value="week">week</Option>
      <Option value="month">month</Option>
    </Select>
  )

  return (
    <div className="form-dark">
      <Form.Item label='Order Time-To-Live' colon={false}>
        {form.getFieldDecorator('timeToLive', {
          initialValue:settings.trading.timeToLive,
          rules:[
            {
              message:"settings.ttl_tip",
              validator: (rule, value, cb) => settingsFormatter.isValidInteger(value) ? cb() : cb(true)
            }
          ]
        })(
          <Input size="large" addonAfter={timeToLiveSelectAfter} onChange={handleChange.bind(this, "timeToLive")}/>
        )}
      </Form.Item>
      <Form.Item label='Trading Fee (LRC)' colon={false}>
        {form.getFieldDecorator('lrcFee', {
          initialValue:settings.trading.lrcFee,
          rules:[
            {message: "settings.ttl_tip".concat('(0~50)') ,
              validator: (rule, value, cb) => validateLrcFee(value) ? cb() : cb(true)
            }
          ]
        })(
          <Input size="large" addonAfter="‰" onChange={handleChange.bind(this, "lrcFee")}/>
        )}
      </Form.Item>
      <Form.Item label='Default Margin Split' colon={false}>
        {form.getFieldDecorator('marginSplit', {
          initialValue:settings.trading.marginSplit,
          rules:[
            {message: "settings.ttl_tip".concat('(0~100)'),
              validator: (rule, value, cb) => validateMarginSplit(value) ? cb() : cb(true)
            }
          ]
        })(
          <Input size="large" addonAfter="％" onChange={handleChange.bind(this, "marginSplit")}/>
        )}
      </Form.Item>
      <Form.Item label={'Default Gas Price:  '+ settings.trading.gasPrice+" Gwei"} colon={false} className="mb5">
        {form.getFieldDecorator('gasPrice', {
          initialValue:Number([settings.trading.gasPrice]),
          rules:[]
        })(
          <Slider min={1} max={99} step={1} onChange={handleChange.bind(this, "gasPrice")}
                  marks={{
                    1: 'slow' ,
                    99: 'fast' ,
                  }}
          />
        )}
      </Form.Item>
      <Button className="btn-o-dark btn-block btn-xlg" onClick={handleReset}>Reset</Button>
  </div>
  )
}
export default Form.create()(Trade);
