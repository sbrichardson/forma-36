import React, { Component, RefObject, FocusEvent, KeyboardEvent } from 'react';
import cn from 'classnames';
import CopyButton from '../CopyButton';
import styles from './TextInput.css';

export type TextInputProps = {
  width?: 'small' | 'medium' | 'large' | 'full';
  isReadOnly?: boolean;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'search'
    | 'url'
    | 'date'
    | 'time';
  name?: string;
  id?: string;
  className?: string;
  withCopyButton?: boolean;
  testId?: string;
  onCopy?: (value: string) => void;
  value?: string;
  inputRef?: RefObject<HTMLInputElement>;
  error?: boolean;
  willBlurOnEsc: boolean;
} & JSX.IntrinsicElements['input'] &
  typeof defaultProps;

export interface TextInputState {
  value?: string;
}

const defaultProps = {
  withCopyButton: false,
  testId: 'cf-ui-text-input',
  disabled: false,
  isReadOnly: false,
  required: false,
  width: 'full',
  willBlurOnEsc: true,
};

export class TextInput extends Component<TextInputProps, TextInputState> {
  static defaultProps = defaultProps;

  state = {
    value: this.props.value,
  };

  UNSAFE_componentWillReceiveProps(nextProps: TextInputProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  handleFocus = (e: FocusEvent) => {
    if (this.props.disabled) {
      (e.target as HTMLInputElement).select();
    }
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const ESC = 27;

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }

    if (e.keyCode === ESC && this.props.willBlurOnEsc) {
      e.currentTarget.blur();
    }
  };

  render() {
    const {
      className,
      withCopyButton,
      placeholder,
      maxLength,
      disabled,
      required,
      isReadOnly,
      onChange,
      testId,
      onBlur,
      onCopy,
      error,
      width,
      value,
      type,
      name,
      id,
      inputRef,
      willBlurOnEsc,
      ...otherProps
    } = this.props;

    const widthClass = `TextInput--${width}`;
    const classNames = cn(styles['TextInput'], className, styles[widthClass], {
      [styles['TextInput--disabled']]: disabled,
      [styles['TextInput--negative']]: error,
    });

    return (
      <div className={classNames}>
        <input
          onKeyDown={this.handleKeyDown}
          aria-label={name}
          className={styles['TextInput__input']}
          id={id}
          name={name}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          data-test-id={testId}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={this.handleFocus}
          onChange={e => {
            if (disabled || isReadOnly) return;

            if (onChange) {
              onChange(e);
            }
            this.setState({ value: e.target.value });
          }}
          value={this.state.value}
          type={type}
          ref={inputRef}
          {...otherProps}
        />
        {withCopyButton && (
          <CopyButton
            onCopy={onCopy}
            copyValue={this.state.value}
            className={styles['TextInput__copy-button']}
          />
        )}
      </div>
    );
  }
}

export default TextInput;
