import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';

const DropdownComponent = props => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const data = props.data;
  return (
    // <View style={styles.container}>
    //   {renderLabel()}
    <Dropdown
      style={[styles.dropdown]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      itemTextStyle={styles.selectedTextStyle}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isFocus ? props.list : '...'}
      searchPlaceholder={'Search...'}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item.value);
        // console.log(item.value);
        props.handler(item.value, props.obj);
        setIsFocus(false);
      }}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // padding: 16,
  },
  dropdown: {
    height: 40,
    width: 100,
    marginHorizontal: 3,
    borderColor: 'maroon',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: 'black',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    color: 'black',
    fontWeight: '300',
    fontSize: 14,
  },
  placeholderStyle: {
    fontWeight: '300',
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
